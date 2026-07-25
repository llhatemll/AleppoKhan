import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GOVERNORATES } from "@/lib/constants";
import { sendOrderNotification } from "@/lib/telegram";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { logNotifError } from "@/lib/notificationLog";
import { rateLimit, getIp } from "@/lib/rateLimit";

const IRAQI_PHONE_REGEX = /^(?:\+?964|0)?7\d{9}$/;

export async function POST(req: NextRequest) {
  if (!rateLimit(`order:${getIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "لقد أرسلت طلبات كثيرة جداً، حاول بعد ساعة" }, { status: 429 });
  }

  const body = await req.json();
  const { fullName, phone, governorate, address, notes, items } = body as {
    fullName?: string;
    phone?: string;
    governorate?: string;
    address?: string;
    notes?: string;
    items?: { productId: string; quantity: number }[];
  };

  if (!fullName || fullName.trim().length < 3)
    return NextResponse.json({ error: "الاسم الكامل غير صحيح" }, { status: 400 });
  if (!phone || !IRAQI_PHONE_REGEX.test(phone.replace(/\s|-/g, "")))
    return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
  if (!governorate || !GOVERNORATES.includes(governorate as (typeof GOVERNORATES)[number]))
    return NextResponse.json({ error: "المحافظة غير صحيحة" }, { status: 400 });
  if (!address || address.trim().length < 5)
    return NextResponse.json({ error: "العنوان غير صحيح" }, { status: 400 });
  if (!items || items.length === 0)
    return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let subtotal = 0;
  const orderItemsData: { productId: string; quantity: number; price: number }[] = [];
  let hasDeliveryFee = false;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product)
      return NextResponse.json({ error: "منتج غير موجود" }, { status: 400 });
    if (item.quantity < 1 || item.quantity > product.stock)
      return NextResponse.json({ error: `الكمية المتوفرة من "${product.title}" غير كافية` }, { status: 400 });
    subtotal += product.price * item.quantity;
    if ((product.deliveryFee ?? 0) > 0) hasDeliveryFee = true;
    orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });
  }

  const total = subtotal + (hasDeliveryFee ? 5000 : 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        governorate,
        address: address.trim(),
        notes: notes?.trim() || null,
        total,
        status: "PENDING" as const,
        items: { create: orderItemsData },
      },
    });
    for (const item of orderItemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return created;
  });

  const notifPayload = {
    id: order.id,
    fullName: order.fullName,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    notes: order.notes,
    total: order.total,
    deliveryFee: hasDeliveryFee ? 5000 : 0,
    items: orderItemsData.map((i) => ({
      title: products.find((p) => p.id === i.productId)?.title ?? i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
  };

  const orderNum = order.id.slice(-8).toUpperCase();

  // Send notifications in parallel, log any failures
  const [telegramOk, whatsappOk] = await Promise.all([
    sendOrderNotification(notifPayload),
    sendWhatsAppNotification(notifPayload),
  ]);

  if (!telegramOk) logNotifError({ channel: "telegram", orderId: order.id, orderNum, at: Date.now() });
  if (!whatsappOk) logNotifError({ channel: "whatsapp", orderId: order.id, orderNum, at: Date.now() });

  return NextResponse.json({ id: order.id, total: order.total });
}

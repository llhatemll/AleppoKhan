import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GOVERNORATES } from "@/lib/constants";
import { sendOrderNotification } from "@/lib/telegram";

const IRAQI_PHONE_REGEX = /^(?:\+?964|0)?7\d{9}$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, phone, governorate, address, notes, items } = body as {
    fullName?: string;
    phone?: string;
    governorate?: string;
    address?: string;
    notes?: string;
    items?: { productId: string; quantity: number }[];
  };

  if (!fullName || fullName.trim().length < 3) {
    return NextResponse.json({ error: "الاسم الكامل غير صحيح" }, { status: 400 });
  }
  if (!phone || !IRAQI_PHONE_REGEX.test(phone.replace(/\s|-/g, ""))) {
    return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
  }
  if (!governorate || !GOVERNORATES.includes(governorate as (typeof GOVERNORATES)[number])) {
    return NextResponse.json({ error: "المحافظة غير صحيحة" }, { status: 400 });
  }
  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: "العنوان غير صحيح" }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let total = 0;
  const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "منتج غير موجود" }, { status: 400 });
    }
    if (item.quantity < 1 || item.quantity > product.stock) {
      return NextResponse.json(
        { error: `الكمية المتوفرة من "${product.title}" غير كافية` },
        { status: 400 }
      );
    }
    total += product.price * item.quantity;
    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

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

  // fire-and-forget Telegram notification
  sendOrderNotification({
    id: order.id,
    fullName: order.fullName,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    notes: order.notes,
    total: order.total,
    items: orderItemsData.map((i) => ({
      title: products.find((p) => p.id === i.productId)?.title ?? i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
  });

  return NextResponse.json({ id: order.id, total: order.total });
}

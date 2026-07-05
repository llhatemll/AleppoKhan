import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const { title, description, price, category, stock, imageUrl, images, deliveryFee, featured, soldOut } = body;

  if (!title || !description || !category || !imageUrl) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }
  if (typeof price !== "number" || price < 0) {
    return NextResponse.json({ error: "السعر غير صحيح" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      title, description, price: Math.round(price), category,
      stock: Math.max(0, Math.round(stock ?? 0)),
      imageUrl,
      images: Array.isArray(images) ? images : [],
      deliveryFee: typeof deliveryFee === "number" ? deliveryFee : 0,
      featured: featured === true,
      soldOut: soldOut === true,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "لا يمكن حذف هذا المنتج لأنه مرتبط بطلبات سابقة" },
      { status: 400 }
    );
  }
}

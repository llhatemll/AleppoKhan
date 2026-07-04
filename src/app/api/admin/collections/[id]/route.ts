import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, description, imageUrl, price, active, items } = body as {
    title: string; description: string; imageUrl: string;
    price: number; active: boolean;
    items: { productId: string; quantity: number }[];
  };

  // delete old items then recreate
  await prisma.collectionItem.deleteMany({ where: { collectionId: id } });

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description?.trim() ?? "",
      imageUrl: imageUrl ?? "",
      price,
      active: active ?? true,
      items: {
        create: (items ?? []).map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(collection);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  await prisma.collection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

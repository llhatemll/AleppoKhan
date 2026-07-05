import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const body = await req.json();
  const { title, description, imageUrl, price, discountedPrice, active, items } = body as {
    title: string; description: string; imageUrl: string;
    price: number; discountedPrice?: number | null; active: boolean;
    items: { productId: string; quantity: number }[];
  };

  if (!title?.trim()) return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  if (!price || price <= 0) return NextResponse.json({ error: "السعر غير صحيح" }, { status: 400 });

  const collection = await prisma.collection.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? "",
      imageUrl: imageUrl ?? "",
      price,
      discountedPrice: discountedPrice ?? null,
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

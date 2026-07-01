import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const { title, description, price, category, stock, imageUrl } = body;

  if (!title || !description || !category || !imageUrl) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }
  if (typeof price !== "number" || price < 0) {
    return NextResponse.json({ error: "السعر غير صحيح" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: Math.round(price),
      category,
      stock: Math.max(0, Math.round(stock ?? 0)),
      imageUrl,
    },
  });

  return NextResponse.json(product);
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId مطلوب" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  // 3 reviews per hour per IP
  if (!rateLimit(`review:${getIp(req)}`, 3, 60 * 60_000)) {
    return NextResponse.json({ error: "لقد أرسلت عدداً كبيراً من التقييمات، حاول بعد ساعة" }, { status: 429 });
  }

  const body = await req.json();
  const { productId, name, governorate, comment, rating } = body;

  if (!productId || !name || !governorate || !comment || !rating) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "التقييم يجب أن يكون بين 1 و 5" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length > 100) {
    return NextResponse.json({ error: "الاسم طويل جداً" }, { status: 400 });
  }
  if (typeof comment !== "string" || comment.length > 1000) {
    return NextResponse.json({ error: "التعليق طويل جداً (الحد 1000 حرف)" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

  const review = await prisma.review.create({
    data: { productId, name: name.trim(), governorate: governorate.trim(), comment: comment.trim(), rating },
  });
  return NextResponse.json(review, { status: 201 });
}

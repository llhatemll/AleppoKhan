import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const allowed = ["soldOut", "featured"] as const;
  const field = allowed.find((f) => f in body);
  if (!field) return NextResponse.json({ error: "حقل غير صالح" }, { status: 400 });

  const product = await prisma.product.update({
    where: { id },
    data: { [field]: body[field] },
  });
  return NextResponse.json(product);
}

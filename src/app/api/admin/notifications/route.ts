import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { getNotifErrors, dismissNotifError } from "@/lib/notificationLog";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const sinceParam = req.nextUrl.searchParams.get("since");
  const since = sinceParam ? new Date(parseInt(sinceParam)) : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [newOrders, pendingReviews] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gt: since } } }),
    prisma.review.count({ where: { approved: false } }),
  ]);

  return NextResponse.json({
    newOrders,
    pendingReviews,
    errors: getNotifErrors(),
  });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await req.json();
  dismissNotifError(id);
  return NextResponse.json({ ok: true });
}

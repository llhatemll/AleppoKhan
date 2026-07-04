import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { setContent, type ContentKey } from "@/lib/siteContent";

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json() as { key: ContentKey; value: string };
  if (!body.key) return NextResponse.json({ error: "مفتاح مطلوب" }, { status: 400 });

  const row = await setContent(body.key, body.value ?? "");
  return NextResponse.json(row);
}

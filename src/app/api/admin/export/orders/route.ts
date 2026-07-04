import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const period = req.nextUrl.searchParams.get("period") ?? "all";

  let dateFilter: { gte: Date } | undefined;
  const now = new Date();
  if (period === "day") {
    const d = new Date(now); d.setHours(0, 0, 0, 0);
    dateFilter = { gte: d };
  } else if (period === "week") {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    dateFilter = { gte: d };
  } else if (period === "month") {
    const d = new Date(now); d.setMonth(d.getMonth() - 1);
    dateFilter = { gte: d };
  }

  const orders = await prisma.order.findMany({
    where: dateFilter ? { createdAt: dateFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const rows = orders.flatMap((o) =>
    o.items.map((item) => ({
      "رقم الطلب": `#${o.id.slice(-8).toUpperCase()}`,
      "الاسم الكامل": o.fullName,
      "رقم الهاتف": o.phone,
      "المحافظة": o.governorate,
      "العنوان": o.address,
      "ملاحظات": o.notes ?? "",
      "المنتج": item.product.title,
      "الكمية": item.quantity,
      "سعر الوحدة": item.price,
      "إجمالي المنتج": item.price * item.quantity,
      "إجمالي الطلب": o.total,
      "الحالة": o.status,
      "تاريخ الطلب": new Date(o.createdAt).toLocaleString("ar-IQ"),
    }))
  );

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "الطلبات");

  // set column widths
  ws["!cols"] = [
    { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 28 },
    { wch: 20 }, { wch: 28 }, { wch: 8 }, { wch: 14 }, { wch: 16 },
    { wch: 16 }, { wch: 14 }, { wch: 22 },
  ];

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const periodLabel: Record<string, string> = { day: "يوم", week: "اسبوع", month: "شهر", all: "كل" };
  const filename = `طلبات-حلب-خان-${periodLabel[period] ?? "كل"}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIQD, statusLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, totalOrders, products] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.order.count(),
    prisma.product.count(),
  ]);

  const totalSales = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELED" } },
  });

  const stats = [
    { label: "إجمالي المبيعات", value: formatIQD(totalSales._sum.total ?? 0) },
    { label: "عدد الطلبات", value: totalOrders.toString() },
    { label: "عدد المنتجات", value: products.toString() },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl">نظرة عامة</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-ink p-6">
            <p className="text-sm text-ink/60 mb-2">{s.label}</p>
            <p className="font-display font-extrabold text-2xl text-clay">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-ink">
        <div className="flex items-center justify-between p-4 border-b border-ink">
          <h2 className="font-display font-bold text-lg">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-clay hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink text-right">
                <th className="p-3 font-bold">الزبون</th>
                <th className="p-3 font-bold">المحافظة</th>
                <th className="p-3 font-bold">الإجمالي</th>
                <th className="p-3 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/10 hover:bg-mustard/5">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="hover:text-clay font-bold">
                      {o.fullName}
                    </Link>
                  </td>
                  <td className="p-3">{o.governorate}</td>
                  <td className="p-3 font-bold">{formatIQD(o.total)}</td>
                  <td className="p-3">{statusLabel(o.status)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-ink/50">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIQD, statusLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl">الطلبات</h1>

      <div className="border border-ink overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink text-right">
              <th className="p-3 font-bold">رقم الطلب</th>
              <th className="p-3 font-bold">الزبون</th>
              <th className="p-3 font-bold">الهاتف</th>
              <th className="p-3 font-bold">المحافظة</th>
              <th className="p-3 font-bold">الإجمالي</th>
              <th className="p-3 font-bold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink/10 hover:bg-mustard/5">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-bold text-clay hover:underline" dir="ltr">
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-3 font-bold">{o.fullName}</td>
                <td className="p-3" dir="ltr">{o.phone}</td>
                <td className="p-3">{o.governorate}</td>
                <td className="p-3 font-bold">{formatIQD(o.total)}</td>
                <td className="p-3">{statusLabel(o.status)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink/50">
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

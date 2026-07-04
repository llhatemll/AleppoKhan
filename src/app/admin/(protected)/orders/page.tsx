import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIQD, statusLabel } from "@/lib/constants";
import OrdersExport from "@/components/admin/OrdersExport";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--fg)" }}>
          الطلبات
        </h1>
        <OrdersExport />
      </div>

      <div className="overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-cream)" }}>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>رقم الطلب</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>الزبون</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>الهاتف</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>المحافظة</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>الإجمالي</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>الحالة</th>
              <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }}
                className="hover:opacity-80 transition-opacity">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-bold hover:underline" dir="ltr"
                    style={{ color: "var(--accent2)" }}>
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-3 font-bold" style={{ color: "var(--fg)" }}>{o.fullName}</td>
                <td className="p-3" dir="ltr" style={{ color: "var(--fg-muted)" }}>{o.phone}</td>
                <td className="p-3" style={{ color: "var(--fg-muted)" }}>{o.governorate}</td>
                <td className="p-3 font-bold" style={{ color: "var(--fg)" }}>{formatIQD(o.total)}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-bold" style={{
                    background: o.status === "PENDING" ? "var(--bg-cream)" : o.status === "DELIVERED" ? "#d1fae5" : "var(--bg-card)",
                    color: "var(--fg)",
                    border: "1px solid var(--border)",
                  }}>
                    {statusLabel(o.status)}
                  </span>
                </td>
                <td className="p-3 text-xs" style={{ color: "var(--fg-muted)" }}>
                  {new Date(o.createdAt).toLocaleDateString("ar-IQ")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center" style={{ color: "var(--fg-muted)" }}>
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

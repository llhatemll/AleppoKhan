import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/constants";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl" dir="ltr">
          #{order.id.slice(-8).toUpperCase()}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="border border-ink p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="الاسم الكامل" value={order.fullName} />
        <Field label="رقم الهاتف" value={order.phone} dir="ltr" />
        <Field label="المحافظة" value={order.governorate} />
        <Field label="العنوان" value={order.address} />
        {order.notes && <Field label="ملاحظات" value={order.notes} />}
      </div>

      <div className="border border-ink">
        <div className="p-4 border-b border-ink font-display font-bold">المنتجات</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink text-right">
              <th className="p-3 font-bold">المنتج</th>
              <th className="p-3 font-bold">الكمية</th>
              <th className="p-3 font-bold">السعر</th>
              <th className="p-3 font-bold">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-ink/10">
                <td className="p-3 font-bold">{item.product.title}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{formatIQD(item.price)}</td>
                <td className="p-3 font-bold">{formatIQD(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-ink flex justify-between font-display font-bold text-lg">
          <span>الإجمالي</span>
          <span className="text-clay">{formatIQD(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className="font-bold" dir={dir}>
        {value}
      </p>
    </div>
  );
}

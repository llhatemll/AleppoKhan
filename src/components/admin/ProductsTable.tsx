"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { categoryLabel, formatIQD } from "@/lib/constants";
import type { Product } from "@/types";

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "حدث خطأ");
        return;
      }
      toast.success("تم حذف المنتج");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="border border-ink overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink text-right">
            <th className="p-3 font-bold">المنتج</th>
            <th className="p-3 font-bold">التصنيف</th>
            <th className="p-3 font-bold">السعر</th>
            <th className="p-3 font-bold">المخزون</th>
            <th className="p-3 font-bold">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-ink/10 hover:bg-mustard/5">
              <td className="p-3 font-bold">{p.title}</td>
              <td className="p-3">{categoryLabel(p.category)}</td>
              <td className="p-3">{formatIQD(p.price)}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3 flex items-center gap-3">
                <Link href={`/admin/products/${p.id}`} className="text-clay font-bold hover:underline">
                  تعديل
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-ink/60 hover:text-clay font-bold disabled:opacity-40"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-ink/50">
                لا توجد منتجات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

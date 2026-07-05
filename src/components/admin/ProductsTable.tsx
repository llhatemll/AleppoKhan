"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { categoryLabel, formatIQD } from "@/lib/constants";
import type { Product } from "@/types";

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); return; }
      toast.success("تم حذف المنتج");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, field: "soldOut" | "featured", current: boolean) {
    setTogglingId(id + field);
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) { toast.error("حدث خطأ"); return; }
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-right" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>المنتج</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>التصنيف</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>السعر</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>المخزون</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>مميز</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>نفاد</th>
            <th className="p-3 font-bold" style={{ color: "var(--fg)" }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {p.imageUrl && (
                    <div className="relative w-10 h-10 overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--border)" }}>
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <span className="font-bold" style={{ color: "var(--fg)" }}>{p.title}</span>
                </div>
              </td>
              <td className="p-3" style={{ color: "var(--fg-muted)" }}>{categoryLabel(p.category)}</td>
              <td className="p-3 font-bold" style={{ color: "var(--fg)" }}>{formatIQD(p.price)}</td>
              <td className="p-3" style={{ color: "var(--fg-muted)" }}>{p.stock}</td>
              <td className="p-3">
                <button
                  onClick={() => handleToggle(p.id, "featured", p.featured)}
                  disabled={togglingId === p.id + "featured"}
                  className="px-2 py-1 text-xs font-bold transition-colors disabled:opacity-40"
                  style={{ background: p.featured ? "var(--fg)" : "var(--bg-cream)", color: p.featured ? "var(--bg)" : "var(--fg)", border: "1px solid var(--border)" }}>
                  {p.featured ? "✓ مميز" : "—"}
                </button>
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleToggle(p.id, "soldOut", p.soldOut)}
                  disabled={togglingId === p.id + "soldOut"}
                  className="px-2 py-1 text-xs font-bold transition-colors disabled:opacity-40"
                  style={{ background: p.soldOut ? "#ef4444" : "var(--bg-cream)", color: p.soldOut ? "#fff" : "var(--fg)", border: "1px solid var(--border)" }}>
                  {p.soldOut ? "نفد" : "—"}
                </button>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <Link href={`/admin/products/${p.id}`} className="font-bold hover:underline" style={{ color: "var(--fg)" }}>
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="font-bold disabled:opacity-40 hover:opacity-60"
                    style={{ color: "#ef4444" }}>
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="p-6 text-center" style={{ color: "var(--fg-muted)" }}>
                لا توجد منتجات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

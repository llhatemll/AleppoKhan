"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Review = {
  id: string;
  name: string;
  governorate: string;
  comment: string;
  rating: number;
  approved: boolean;
  createdAt: Date | string;
  product: { title: string };
};

function Stars({ rating }: { rating: number }) {
  return (
    <span dir="ltr" className="text-sm">
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#f59e0b" : "var(--border)" }}>★</span>
      ))}
    </span>
  );
}

export default function AdminReviewsTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleApprove(id: string, approved: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) { toast.error("حدث خطأ"); return; }
      toast.success(approved ? "تمت الموافقة على التقييم ✓" : "تم إلغاء الموافقة");
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("حدث خطأ"); return; }
      toast.success("تم حذف التقييم");
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  function renderRows(list: Review[]) {
    return list.map((r) => (
      <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
        <td className="p-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>{r.name}</span>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{r.governorate}</span>
          </div>
        </td>
        <td className="p-3 text-xs max-w-xs" style={{ color: "var(--fg)" }}>{r.product.title}</td>
        <td className="p-3"><Stars rating={r.rating} /></td>
        <td className="p-3 text-xs max-w-xs" style={{ color: "var(--fg)" }}>{r.comment}</td>
        <td className="p-3 text-xs" style={{ color: "var(--fg-muted)" }}>
          {new Date(r.createdAt).toLocaleDateString("ar-IQ")}
        </td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            {r.approved ? (
              <button onClick={() => handleApprove(r.id, false)} disabled={loadingId === r.id}
                className="px-2 py-1 text-xs font-bold disabled:opacity-40"
                style={{ border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
                إلغاء
              </button>
            ) : (
              <button onClick={() => handleApprove(r.id, true)} disabled={loadingId === r.id}
                className="px-2 py-1 text-xs font-bold disabled:opacity-40"
                style={{ background: "var(--fg)", color: "var(--bg)", border: "1px solid var(--fg)" }}>
                موافقة
              </button>
            )}
            <button onClick={() => handleDelete(r.id)} disabled={loadingId === r.id}
              className="px-2 py-1 text-xs font-bold disabled:opacity-40"
              style={{ color: "#ef4444", border: "1px solid #ef4444" }}>
              حذف
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div className="flex flex-col gap-8">
      {pending.length > 0 && (
        <div>
          <h2 className="font-bold text-sm mb-3 px-1" style={{ color: "#f59e0b" }}>بانتظار الموافقة ({pending.length})</h2>
          <div className="overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
                  {["العميل", "المنتج", "التقييم", "التعليق", "التاريخ", "إجراء"].map((h) => (
                    <th key={h} className="p-3 font-bold" style={{ color: "var(--fg)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderRows(pending)}</tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-sm mb-3 px-1" style={{ color: "var(--fg-muted)" }}>المعتمدة ({approved.length})</h2>
        <div className="overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
                {["العميل", "المنتج", "التقييم", "التعليق", "التاريخ", "إجراء"].map((h) => (
                  <th key={h} className="p-3 font-bold" style={{ color: "var(--fg)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approved.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center" style={{ color: "var(--fg-muted)" }}>لا توجد تقييمات معتمدة</td></tr>
              ) : renderRows(approved)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

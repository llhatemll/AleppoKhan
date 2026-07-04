"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const PERIODS = [
  { value: "day", label: "آخر يوم" },
  { value: "week", label: "آخر أسبوع" },
  { value: "month", label: "آخر شهر" },
  { value: "all", label: "كل البيانات" },
] as const;

export default function OrdersExport() {
  const [period, setPeriod] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/export/orders?period=${period}`);
      if (!res.ok) { toast.error("فشل التحميل"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `طلبات-حلب-خان.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل الملف ✓");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-bold" style={{ color: "var(--fg-muted)" }}>تصدير:</span>
      <div className="flex" style={{ border: "1px solid var(--border)" }}>
        {PERIODS.map((p) => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className="px-3 py-2 text-xs font-bold transition-colors"
            style={{
              background: period === p.value ? "var(--fg)" : "var(--bg-card)",
              color: period === p.value ? "var(--bg)" : "var(--fg)",
              borderLeft: "1px solid var(--border)",
            }}>
            {p.label}
          </button>
        ))}
      </div>
      <button onClick={handleExport} disabled={loading} className="btn-primary text-sm px-4 py-2">
        {loading ? "جاري التحميل..." : "⬇ تحميل Excel"}
      </button>
    </div>
  );
}

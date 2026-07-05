"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import InputField from "@/components/InputField";

const GOVERNORATES = [
  "بغداد", "البصرة", "نينوى", "أربيل", "السليمانية", "كركوك", "الأنبار",
  "بابل", "كربلاء", "النجف", "ذي قار", "المثنى", "القادسية", "واسط",
  "ميسان", "صلاح الدين", "ديالى", "دهوك",
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="text-2xl leading-none transition-transform hover:scale-110"
          style={{ color: star <= (hover || value) ? "#f59e0b" : "var(--border)" }}>
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted?: () => void }) {
  const [form, setForm] = useState({ name: "", governorate: "", comment: "", rating: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.governorate) e.governorate = "اختر محافظتك";
    if (!form.comment.trim()) e.comment = "الرأي مطلوب";
    if (form.rating === 0) e.rating = "اختر التقييم";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (!res.ok) { toast.error("حدث خطأ، حاول مرة أخرى"); return; }
      toast.success("شكراً لتقييمك! سيظهر بعد المراجعة ✓");
      setForm({ name: "", governorate: "", comment: "", rating: 0 });
      setErrors({});
      onSubmitted?.();
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <h3 className="font-bold text-base" style={{ color: "var(--fg)" }}>أضف تقييمك</h3>

      <div>
        <span className="font-bold text-sm block mb-1.5" style={{ color: "var(--fg)" }}>تقييمك <span style={{ color: "#ef4444" }}>*</span></span>
        <StarPicker value={form.rating} onChange={(v) => { setForm({ ...form, rating: v }); setErrors({ ...errors, rating: "" }); }} />
        {errors.rating && <p className="text-xs mt-1 font-bold" style={{ color: "#ef4444" }}>⚠ {errors.rating}</p>}
      </div>

      <InputField label="اسمك" required placeholder="مثال: أحمد محمد"
        value={form.name} error={errors.name}
        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }} />

      <InputField label="محافظتك" as="select" required value={form.governorate} error={errors.governorate}
        onChange={(e) => { setForm({ ...form, governorate: e.target.value }); setErrors({ ...errors, governorate: "" }); }}>
        <option value="">اختر المحافظة...</option>
        {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
      </InputField>

      <InputField label="رأيك في المنتج" as="textarea" rows={3} required placeholder="شاركنا تجربتك مع المنتج..."
        value={form.comment} error={errors.comment}
        onChange={(e) => { setForm({ ...form, comment: e.target.value }); setErrors({ ...errors, comment: "" }); }} />

      <button type="submit" disabled={loading} className="btn-primary py-3 text-sm">
        {loading ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
}

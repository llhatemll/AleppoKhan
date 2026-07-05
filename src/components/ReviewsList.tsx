"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  name: string;
  governorate: string;
  comment: string;
  rating: number;
  createdAt: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className="text-base leading-none" style={{ color: s <= rating ? "#f59e0b" : "var(--border)" }}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsList({ productId, refresh }: { productId: string; refresh?: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [productId, refresh]);

  if (loading) return <div className="py-4 text-center text-sm" style={{ color: "var(--fg-muted)" }}>جاري التحميل...</div>;
  if (!reviews.length) return (
    <div className="py-6 text-center" style={{ color: "var(--fg-muted)" }}>
      <p className="text-sm">لا توجد تقييمات بعد — كن أول من يقيّم هذا المنتج!</p>
    </div>
  );

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 py-3 px-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <span className="text-3xl font-black" style={{ color: "var(--fg)" }}>{avg.toFixed(1)}</span>
        <div className="flex flex-col gap-0.5">
          <Stars rating={Math.round(avg)} />
          <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{reviews.length} تقييم</span>
        </div>
      </div>
      {reviews.map((r) => (
        <div key={r.id} className="p-4 flex flex-col gap-2" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>{r.name}</span>
              <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{r.governorate}</span>
            </div>
            <Stars rating={r.rating} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{r.comment}</p>
          <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
            {new Date(r.createdAt).toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      ))}
    </div>
  );
}

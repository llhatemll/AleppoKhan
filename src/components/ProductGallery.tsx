"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  if (!images.length) return (
    <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: "var(--fg-muted)" }}>لا توجد صورة</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#fff", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <Image src={images[active]} alt={title} fill className="object-cover" unoptimized />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center font-bold text-lg"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid var(--border)", color: "var(--fg)" }}>›</button>
            <button onClick={() => setActive((i) => (i + 1) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center font-bold text-lg"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid var(--border)", color: "var(--fg)" }}>‹</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setActive(idx)}
              className="relative flex-shrink-0 w-16 h-16 overflow-hidden"
              style={{ border: `2px solid ${active === idx ? "var(--fg)" : "var(--border)"}`, opacity: active === idx ? 1 : 0.6 }}>
              <Image src={img} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

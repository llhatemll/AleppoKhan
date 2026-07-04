"use client";
import { useState } from "react";

export default function AnnouncementBar({ text }: { text: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="relative flex items-center justify-center px-8 py-2.5 text-xs sm:text-sm font-bold tracking-wide text-center"
      style={{ background: "var(--fg)", color: "var(--bg)" }}>
      {text}
      <button onClick={() => setVisible(false)} aria-label="إغلاق"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 text-lg leading-none">
        ×
      </button>
    </div>
  );
}

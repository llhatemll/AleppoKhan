"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type NotifError = {
  id: string;
  channel: "telegram" | "whatsapp";
  orderId: string;
  orderNum: string;
  at: number;
};

type NotifData = {
  newOrders: number;
  pendingReviews: number;
  errors: NotifError[];
};

const STORAGE_KEY = "ak_notif_since";
const POLL_MS = 30_000;

export default function NotificationBell() {
  const [data, setData] = useState<NotifData>({ newOrders: 0, pendingReviews: 0, errors: [] });
  const [open, setOpen] = useState(false);
  const sinceRef = useRef<number>(Date.now() - 24 * 60 * 60 * 1000);
  const prevRef = useRef<NotifData | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const total = data.newOrders + data.pendingReviews + data.errors.length;
  const hasError = data.errors.length > 0;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/notifications?since=${sinceRef.current}`);
      if (!res.ok) return;
      const next: NotifData = await res.json();

      // Browser notifications for new items since last poll
      if (prevRef.current && typeof Notification !== "undefined" && Notification.permission === "granted") {
        if (next.newOrders > prevRef.current.newOrders) {
          new Notification("خان حلب — طلب جديد 🛒", {
            body: `لديك ${next.newOrders} طلب جديد`,
            icon: "/favicon.ico",
            tag: "new-order",
          });
        }
        if (next.pendingReviews > prevRef.current.pendingReviews) {
          new Notification("خان حلب — تقييم جديد ★", {
            body: `${next.pendingReviews} تقييم ينتظر الموافقة`,
            icon: "/favicon.ico",
            tag: "new-review",
          });
        }
        if (next.errors.length > prevRef.current.errors.length) {
          new Notification("خان حلب — خطأ في الإشعارات ⚠️", {
            body: "فشل إرسال إشعار طلب — افتح لوحة التحكم للتفاصيل",
            icon: "/favicon.ico",
            tag: "notif-error",
          });
        }
      }

      prevRef.current = next;
      setData(next);
    } catch {
      // silently ignore — don't disrupt admin UI
    }
  }, []);

  // Bootstrap: load stored since, request permission, start polling
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) sinceRef.current = parseInt(stored);

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    fetchData();
    const id = setInterval(fetchData, POLL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next) {
      // Mark everything as seen
      const now = Date.now();
      sinceRef.current = now;
      localStorage.setItem(STORAGE_KEY, String(now));
      setTimeout(fetchData, 400);
    }
  }

  async function dismissError(id: string) {
    await fetch("/api/admin/notifications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({ ...d, errors: d.errors.filter((e) => e.id !== id) }));
  }

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        aria-label="الإشعارات"
        style={{
          position: "relative",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "1px solid var(--border)",
          cursor: "pointer",
          color: "var(--fg)",
          flexShrink: 0,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {total > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            left: "-5px",
            minWidth: "16px",
            height: "16px",
            borderRadius: "8px",
            padding: "0 3px",
            background: hasError ? "#E8422A" : "var(--fg)",
            color: hasError ? "#fff" : "var(--bg)",
            fontSize: "9px",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}>
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: "0",
          width: "290px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
          zIndex: 200,
          direction: "rtl",
        }}>
          <div style={{
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontWeight: "700", fontSize: "13px", color: "var(--fg)" }}>الإشعارات</span>
            <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>تحديث كل ٣٠ ث</span>
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>

            {/* Notification errors */}
            {data.errors.map((err) => (
              <div key={err.id} style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                background: "rgba(232,66,42,0.04)",
              }}>
                <span style={{ color: "#E8422A", fontSize: "15px", lineHeight: 1, marginTop: "1px" }}>⚠</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#E8422A", margin: "0 0 3px" }}>
                    فشل إرسال {err.channel === "telegram" ? "Telegram" : "WhatsApp"}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--fg-muted)", margin: 0 }}>
                    طلب #{err.orderNum} — {new Date(err.at).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button
                  onClick={() => dismissError(err.id)}
                  aria-label="إغلاق"
                  style={{ fontSize: "18px", lineHeight: 1, color: "var(--fg-muted)", background: "none", border: "none", cursor: "pointer", padding: "0", flexShrink: 0 }}
                >×</button>
              </div>
            ))}

            {/* New orders */}
            {data.newOrders > 0 && (
              <Link href="/admin/orders" onClick={() => setOpen(false)} style={{
                display: "flex",
                gap: "12px",
                padding: "12px 14px",
                borderBottom: "1px solid var(--border)",
                textDecoration: "none",
                alignItems: "center",
              }}>
                <span style={{ fontSize: "18px", lineHeight: 1 }}>◷</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--fg)", margin: "0 0 2px" }}>
                    {data.newOrders} طلب جديد
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--fg-muted)", margin: 0 }}>منذ آخر تفقد</p>
                </div>
                <span style={{ marginRight: "auto", color: "var(--fg-muted)", fontSize: "13px" }}>←</span>
              </Link>
            )}

            {/* Pending reviews */}
            {data.pendingReviews > 0 && (
              <Link href="/admin/reviews" onClick={() => setOpen(false)} style={{
                display: "flex",
                gap: "12px",
                padding: "12px 14px",
                borderBottom: "1px solid var(--border)",
                textDecoration: "none",
                alignItems: "center",
              }}>
                <span style={{ fontSize: "18px", lineHeight: 1 }}>★</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--fg)", margin: "0 0 2px" }}>
                    {data.pendingReviews} تقييم ينتظر الموافقة
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--fg-muted)", margin: 0 }}>اضغط للمراجعة</p>
                </div>
                <span style={{ marginRight: "auto", color: "var(--fg-muted)", fontSize: "13px" }}>←</span>
              </Link>
            )}

            {total === 0 && (
              <div style={{ padding: "28px 14px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>✓</div>
                <p style={{ fontSize: "13px", color: "var(--fg-muted)", margin: 0 }}>كل شيء على ما يرام</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

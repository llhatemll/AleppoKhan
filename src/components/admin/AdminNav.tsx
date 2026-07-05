"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "نظرة عامة", icon: "◈" },
  { href: "/admin/content", label: "محتوى الموقع", icon: "✎" },
  { href: "/admin/products", label: "المنتجات", icon: "⊞" },
  { href: "/admin/collections", label: "البكجات", icon: "⊟" },
  { href: "/admin/orders", label: "الطلبات", icon: "◷" },
  { href: "/admin/reviews", label: "التقييمات", icon: "★" },
];

export default function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const currentLabel = links.find((l) => l.href === pathname)?.label ?? "الأدمن";

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="w-56 shrink-0 hidden sm:flex flex-col" style={{ borderLeft: "1px solid var(--border)" }}>
        <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-extrabold text-lg" style={{ color: "var(--fg)" }}>
            خان <span style={{ color: "var(--accent)" }}>حلب</span>
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>{username}</p>
        </div>
        <nav className="flex flex-col p-3 gap-1 flex-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className="px-4 py-3 font-bold text-sm transition-colors flex items-center gap-2"
                style={{ background: active ? "var(--fg)" : "transparent", color: active ? "var(--bg)" : "var(--fg)" }}>
                <span className="text-base leading-none">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout}
          className="m-3 px-4 py-3 font-bold text-sm transition-colors hover:opacity-70"
          style={{ border: "1px solid var(--border)", color: "var(--fg)" }}>
          تسجيل الخروج
        </button>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="sm:hidden fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>{currentLabel}</span>
        <div className="flex items-center gap-1">
          <span className="font-display font-extrabold text-base" style={{ color: "var(--fg)" }}>
            خان <span style={{ color: "var(--accent)" }}>حلب</span>
          </span>
          <button onClick={() => setMenuOpen(true)} aria-label="القائمة"
            className="w-10 h-10 flex items-center justify-center mr-1"
            style={{ color: "var(--fg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={() => setMenuOpen(false)} />

          {/* panel — slides in from right (RTL) */}
          <div className="relative mr-auto w-72 h-full flex flex-col"
            style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-display font-extrabold text-lg" style={{ color: "var(--fg)" }}>
                خان <span style={{ color: "var(--accent)" }}>حلب</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="text-2xl leading-none" style={{ color: "var(--fg)" }}>×</button>
            </div>

            <div className="px-3 py-2 text-xs font-bold" style={{ color: "var(--fg-muted)" }}>{username}</div>

            <nav className="flex flex-col px-3 pb-3 gap-1 flex-1 overflow-y-auto">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="px-4 py-3.5 font-bold text-base flex items-center gap-3"
                    style={{ background: active ? "var(--fg)" : "transparent", color: active ? "var(--bg)" : "var(--fg)" }}>
                    <span className="text-lg leading-none">{l.icon}</span>
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={handleLogout}
                className="w-full px-4 py-3 font-bold text-sm"
                style={{ border: "1px solid var(--border)", color: "var(--fg)" }}>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

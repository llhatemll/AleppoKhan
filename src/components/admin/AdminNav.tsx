"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/content", label: "محتوى الموقع" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/collections", label: "البكجات" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/reviews", label: "التقييمات" },
];

export default function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
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
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-3 font-bold text-sm transition-colors"
              style={{
                background: active ? "var(--fg)" : "transparent",
                color: active ? "var(--bg)" : "var(--fg)",
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="m-3 px-4 py-3 font-bold text-sm transition-colors hover:opacity-70"
        style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
      >
        تسجيل الخروج
      </button>
    </aside>
  );
}

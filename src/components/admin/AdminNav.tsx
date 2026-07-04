"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/content", label: "محتوى الموقع" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/collections", label: "الكولكشنات" },
  { href: "/admin/orders", label: "الطلبات" },
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
    <aside className="w-56 shrink-0 border-l border-ink hidden sm:flex flex-col">
      <div className="p-5 border-b border-ink">
        <h2 className="font-display font-extrabold text-lg">
          حلب <span className="text-clay">خان</span>
        </h2>
        <p className="text-xs text-ink/50 mt-1">{username}</p>
      </div>
      <nav className="flex flex-col p-3 gap-1 flex-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-3 font-bold text-sm ${
                active ? "bg-ink text-paper" : "hover:bg-ink/5"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="m-3 px-4 py-3 font-bold text-sm border border-ink hover:bg-clay hover:text-paper transition-colors"
      >
        تسجيل الخروج
      </button>
    </aside>
  );
}

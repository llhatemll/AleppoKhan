import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--fg)" }}>
          الكولكشنات
        </h1>
        <Link href="/admin/collections/new" className="btn-primary text-sm px-5 py-2">
          + كولكشن جديد
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="py-20 text-center" style={{ border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">📦</p>
          <p style={{ color: "var(--fg-muted)" }}>لا توجد كولكشنات بعد</p>
          <Link href="/admin/collections/new" className="btn-primary inline-flex mt-4 text-sm px-5 py-2">
            أضف أول كولكشن
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {collections.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 gap-4"
              style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base" style={{ color: "var(--fg)" }}>{c.title}</span>
                  <span className="text-xs px-2 py-0.5 font-bold" style={{
                    background: c.active ? "#d1fae5" : "var(--bg-cream)",
                    color: c.active ? "#065f46" : "var(--fg-muted)",
                    border: "1px solid var(--border)",
                  }}>
                    {c.active ? "نشط" : "مخفي"}
                  </span>
                </div>
                <p className="text-xs line-clamp-1" style={{ color: "var(--fg-muted)" }}>{c.description}</p>
                <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>
                  {formatIQD(c.price)} · {c.items.length} منتج
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/collections/${c.id}`}
                  className="px-4 py-2 text-sm font-bold transition-opacity hover:opacity-60"
                  style={{ border: "1px solid var(--border)", color: "var(--fg)" }}>
                  تعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

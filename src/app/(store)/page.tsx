import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

const categoryIcons = ["🧼", "🧴", "🫙"];

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-10">

          {/* text side */}
          <div className="flex-1 flex flex-col gap-5">
            <span
              className="self-start text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "var(--accent)", color: "#fff", letterSpacing: "0.05em" }}
            >
              طبيعي ١٠٠٪
            </span>

            <h1
              className="font-display font-extrabold leading-tight"
              style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", color: "var(--fg)" }}
            >
              جمال طبيعي
              <br />
              <span style={{ color: "var(--accent)" }}>من حلب خان</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: "var(--fg-muted)" }}>
              صابون وشامبو وزيوت طبيعية فاخرة، مصنوعة بعناية من أجود المكونات.
              الدفع عند الاستلام في جميع محافظات العراق.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link href="/category/soap" className="btn-primary">
                تسوق الآن
              </Link>
              <Link
                href="/category/oil"
                className="rounded-lg px-6 py-3 text-sm font-bold border transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--fg)", background: "var(--bg)" }}
              >
                اكتشف الزيوت
              </Link>
            </div>
          </div>

          {/* image side — 2×2 grid of product shots on white */}
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-md w-full">
            {products.slice(0, 4).map((p: Product) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{ background: "#fff", boxShadow: "var(--shadow)" }}
              >
                <Image src={p.imageUrl} alt={p.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="200px" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category cards ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-extrabold text-2xl mb-6" style={{ color: "var(--fg)" }}>
          تسوق حسب الفئة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="card group flex flex-col items-center justify-center py-10 px-6 text-center gap-3"
            >
              <span className="text-4xl">{categoryIcons[i]}</span>
              <span className="font-display font-extrabold text-lg" style={{ color: "var(--fg)" }}>
                {c.label}
              </span>
              <span className="text-xs mt-1 font-semibold" style={{ color: "var(--accent)" }}>
                تسوق الآن ←
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured products ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl" style={{ color: "var(--fg)" }}>
            منتجات مميزة
          </h2>
          <Link href="/category/soap" className="text-sm font-semibold hover:opacity-60" style={{ color: "var(--accent)" }}>
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="py-10" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🌿", label: "مكونات طبيعية ١٠٠٪" },
            { icon: "🚚", label: "توصيل لجميع المحافظات" },
            { icon: "💵", label: "الدفع عند الاستلام" },
            { icon: "✅", label: "ضمان الجودة" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

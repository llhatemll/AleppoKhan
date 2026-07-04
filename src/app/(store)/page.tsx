import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/siteContent";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, formatIQD } from "@/lib/constants";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, content] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    getContent(),
  ]);

  const heroLines = content.hero_title.split("\n");

  const catImages: Record<string, string> = {
    SOAP: content.cat_image_soap,
    SHAMPOO: content.cat_image_shampoo,
    OIL: content.cat_image_oil,
  };

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ─── HERO — full width editorial ─── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "clamp(480px,70vh,780px)" }}>
        {/* background */}
        {content.hero_image ? (
          <Image src={content.hero_image} alt="hero" fill priority
            className="object-cover" unoptimized={content.hero_image.startsWith("/uploads/")} />
        ) : (
          <div className="absolute inset-0" style={{ background: "var(--bg-cream)" }} />
        )}
        {/* dark overlay when image is set */}
        {content.hero_image && (
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.38)" }} />
        )}

        {/* text */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-10 pb-14 sm:pb-20 pt-24">
          <div className="max-w-2xl flex flex-col gap-5">
            <h1 className="font-display font-bold leading-tight"
              style={{
                fontSize: "clamp(2.8rem,7vw,6rem)",
                color: content.hero_image ? "#fff" : "var(--fg)",
                lineHeight: 1.1,
              }}>
              {heroLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-md"
              style={{ color: content.hero_image ? "rgba(255,255,255,0.82)" : "var(--fg-muted)" }}>
              {content.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link href="/category/soap" className="btn-primary"
                style={content.hero_image ? { background: "#fff", color: "#0D0D0D" } : {}}>
                {content.hero_btn_text}
              </Link>
              <Link href="/category/oil" className="btn-ghost"
                style={content.hero_image ? { borderColor: "rgba(255,255,255,0.5)", color: "#fff" } : {}}>
                اكتشف الزيوت
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY BANNERS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const img = catImages[c.value];
            return (
              <Link key={c.slug} href={`/category/${c.slug}`}
                className="group relative overflow-hidden flex items-end"
                style={{ aspectRatio: "3/4", background: "var(--bg-cream)" }}>
                {img && (
                  <Image src={img} alt={c.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={img.startsWith("/uploads/")} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
                <div className="relative z-10 p-5 w-full flex items-end justify-between">
                  <span className="font-display font-bold text-xl sm:text-2xl" style={{ color: "#fff" }}>
                    {c.label}
                  </span>
                  <span className="font-bold text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                    تسوق ←
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "var(--fg)" }}>
            {content.section_title}
          </h2>
          <Link href="/category/soap" className="text-sm font-bold tracking-wide hover:opacity-50 transition-opacity"
            style={{ color: "var(--fg)" }}>
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            ["🌿", "مكونات طبيعية ١٠٠٪"],
            ["🚚", "توصيل لجميع المحافظات"],
            ["💵", "الدفع عند الاستلام"],
            ["✅", "ضمان جودة المنتج"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold tracking-wide" style={{ color: "var(--fg-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

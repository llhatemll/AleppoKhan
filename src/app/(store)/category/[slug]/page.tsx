import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, categorySlugToValue } from "@/lib/constants";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const value = categorySlugToValue(slug);
  if (!value) notFound();

  const category = CATEGORIES.find((c) => c.slug === slug)!;
  const products = await prisma.product.findMany({
    where: { category: value },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10" style={{ minHeight: "70vh" }}>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`/category/${c.slug}`}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all"
            style={
              c.slug === slug
                ? { background: "var(--btn-bg)", color: "var(--btn-fg)" }
                : { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" }
            }
          >
            {c.label}
          </a>
        ))}
      </div>

      <h1 className="font-display font-extrabold text-3xl mb-8" style={{ color: "var(--fg)" }}>
        {category.label}
      </h1>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <span className="text-5xl mb-4 block">📦</span>
          <p style={{ color: "var(--fg-muted)" }}>لا توجد منتجات في هذا القسم حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

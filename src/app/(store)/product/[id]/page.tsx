import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { categoryLabel, categoryValueToSlug, formatIQD } from "@/lib/constants";
import AddToCartBox from "@/components/AddToCartBox";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <a
        href={`/category/${categoryValueToSlug(product.category)}`}
        className="inline-flex items-center gap-1 text-sm font-semibold mb-8 hover:opacity-60 transition-opacity"
        style={{ color: "var(--fg-muted)" }}
      >
        ← {categoryLabel(product.category)}
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* image */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ aspectRatio: "1/1", background: "#fff", boxShadow: "var(--shadow)" }}
        >
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
        </div>

        {/* details */}
        <div className="flex flex-col gap-4">
          <span
            className="self-start text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "var(--bg-card)", color: "var(--accent)", border: "1px solid var(--border)" }}
          >
            {categoryLabel(product.category)}
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight" style={{ color: "var(--fg)" }}>
            {product.title}
          </h1>

          <p className="leading-relaxed text-base" style={{ color: "var(--fg-muted)" }}>
            {product.description}
          </p>

          <span className="font-display font-extrabold text-3xl" style={{ color: "var(--accent)" }}>
            {formatIQD(product.price)}
          </span>

          <span className="text-sm" style={{ color: product.stock > 0 ? "var(--fg-muted)" : "var(--accent)" }}>
            {product.stock > 0 ? `✓ متوفر (${product.stock} قطعة)` : "✗ غير متوفر حالياً"}
          </span>

          <div className="mt-2">
            <AddToCartBox product={product} />
          </div>

          {/* trust badges */}
          <div
            className="mt-4 rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {["🌿 مكونات طبيعية ١٠٠٪", "💵 الدفع عند الاستلام", "🚚 توصيل لجميع المحافظات"].map((t) => (
              <span key={t} className="text-sm" style={{ color: "var(--fg-muted)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

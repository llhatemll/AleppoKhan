import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoryLabel, categoryValueToSlug } from "@/lib/constants";
import AddToCartBox from "@/components/AddToCartBox";
import ProductGallery from "@/components/ProductGallery";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const allImages = [product.imageUrl, ...product.images].filter(Boolean);
  const isSoldOut = product.soldOut || product.stock <= 0;

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
        {/* image gallery */}
        <ProductGallery images={allImages} title={product.title} />

        {/* details */}
        <div className="flex flex-col gap-4">
          <span
            className="self-start text-xs font-bold px-3 py-1"
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
            {product.price.toLocaleString("ar-IQ")} د.ع
          </span>

          {product.deliveryFee > 0 ? (
            <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
              🚚 رسوم التوصيل: {product.deliveryFee.toLocaleString("ar-IQ")} د.ع
            </span>
          ) : (
            <span className="text-sm" style={{ color: "var(--fg-muted)" }}>🚚 توصيل مجاني</span>
          )}

          <span className="text-sm" style={{ color: isSoldOut ? "#ef4444" : "var(--fg-muted)" }}>
            {isSoldOut ? "✗ نفد المخزون" : `✓ متوفر (${product.stock} قطعة)`}
          </span>

          <div className="mt-2">
            {isSoldOut ? (
              <div className="py-4 text-center font-bold" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "#ef4444" }}>
                نفد المخزون
              </div>
            ) : (
              <AddToCartBox product={product} />
            )}
          </div>

          <div
            className="mt-4 p-4 flex flex-col gap-2"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {["🌿 مكونات طبيعية ١٠٠٪", "💵 الدفع عند الاستلام", "🚚 توصيل لجميع المحافظات"].map((t) => (
              <span key={t} className="text-sm" style={{ color: "var(--fg-muted)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16 flex flex-col gap-8">
        <h2 className="font-display font-extrabold text-2xl" style={{ color: "var(--fg)" }}>آراء العملاء</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ReviewsList productId={product.id} />
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}

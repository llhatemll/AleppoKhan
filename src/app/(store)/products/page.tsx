import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const products = await prisma.product.findMany({
    where: { soldOut: false },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12" style={{ minHeight: "70vh" }}>
      <div className="mb-10">
        <h1 className="font-display font-bold" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--fg)" }}>
          جميع المنتجات
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--fg-muted)" }}>
          {products.length} منتج متاح
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <span className="text-5xl mb-4 block">🌿</span>
          <p style={{ color: "var(--fg-muted)" }}>لا توجد منتجات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

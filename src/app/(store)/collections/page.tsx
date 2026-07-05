import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/constants";
import CollectionAddButton from "@/components/CollectionAddButton";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12" style={{ minHeight: "70vh" }}>
      <div className="mb-10">
        <h1 className="font-display font-bold" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--fg)" }}>
          البكجات
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--fg-muted)" }}>
          باقات منتجات مختارة بعناية — وفّر أكثر مع الباقة
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="py-24 text-center">
          <span className="text-5xl mb-4 block">📦</span>
          <p style={{ color: "var(--fg-muted)" }}>لا توجد كولكشنات متاحة حالياً</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {collections.map((col) => (
            <div key={col.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12"
              style={{ borderBottom: "1px solid var(--border)" }}>
              {/* image */}
              <div className="relative overflow-hidden"
                style={{ aspectRatio: "4/3", background: "var(--bg-cream)" }}>
                {col.imageUrl ? (
                  <Image src={col.imageUrl} alt={col.title} fill className="object-cover"
                    unoptimized={col.imageUrl.startsWith("/uploads/")} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">🌿</div>
                )}
              </div>

              {/* details */}
              <div className="flex flex-col gap-5 justify-center">
                <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--fg)" }}>
                  {col.title}
                </h2>
                {col.description && (
                  <p className="text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {col.description}
                  </p>
                )}

                {/* products list */}
                <div className="flex flex-col gap-2">
                  {col.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-2"
                      style={{ borderBottom: "1px solid var(--border)" }}>
                      <span style={{ color: "var(--fg)" }}>{item.product.title}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>× {item.quantity}</span>
                        <span className="font-bold" style={{ color: "var(--fg)" }}>{formatIQD(item.product.price * item.quantity)}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-xs font-bold mb-1" style={{ color: "var(--fg-muted)" }}>سعر الباقة</p>
                    <div className="flex items-baseline gap-2">
                      {col.discountedPrice ? (
                        <>
                          <p className="font-display font-bold" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--accent)" }}>
                            {formatIQD(col.discountedPrice)}
                          </p>
                          <p className="text-sm line-through" style={{ color: "var(--fg-muted)" }}>
                            {formatIQD(col.price)}
                          </p>
                        </>
                      ) : (
                        <p className="font-display font-bold" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--fg)" }}>
                          {formatIQD(col.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <CollectionAddButton collection={{
                    id: col.id,
                    title: col.title,
                    price: col.price,
                    imageUrl: col.imageUrl,
                    items: col.items.map((i) => ({
                      productId: i.productId,
                      quantity: i.quantity,
                      product: { id: i.product.id, title: i.product.title, price: i.product.price, imageUrl: i.product.imageUrl, stock: i.product.stock },
                    })),
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

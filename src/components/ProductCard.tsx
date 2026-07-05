"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { formatIQD } from "@/lib/constants";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const isSoldOut = product.soldOut || product.stock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      deliveryFee: product.deliveryFee ?? 0,
    });
    toast.success("تمت إضافة المنتج إلى السلة ✓");
  }

  return (
    <Link href={`/product/${product.id}`} className="group card flex flex-col overflow-hidden">
      {/* image — white bg, object-contain so product is fully visible */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1/1", background: "#fff" }}
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
            <span className="text-white text-xs font-bold px-3 py-1" style={{ background: "rgba(0,0,0,0.6)" }}>نفد المخزون</span>
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-4 flex flex-col gap-1 flex-1" style={{ background: "var(--bg-card)" }}>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: "var(--fg)" }}>
          {product.title}
        </h3>
        <p className="text-xs line-clamp-1 mt-0.5" style={{ color: "var(--fg-muted)" }}>
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display font-extrabold text-base" style={{ color: "var(--accent)" }}>
            {formatIQD(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className="btn-primary text-xs px-3 py-2 rounded-lg"
            style={{ fontSize: "12px", padding: "8px 14px" }}
          >
            {isSoldOut ? "نفد" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </Link>
  );
}

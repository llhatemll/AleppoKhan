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
    toast.success("تمت الإضافة إلى السلة");
  }

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col" style={{ background: "var(--bg-card)" }}>
      {/* image */}
      <div className="product-img-wrap relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#F8F8F8" }}>
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {/* Kylie-style hover overlay */}
        {!isSoldOut && (
          <div className="product-overlay absolute inset-0 flex items-end justify-center pb-5"
            style={{ background: "rgba(0,0,0,0.18)" }}>
            <button
              onClick={handleAdd}
              className="btn-primary py-3 w-4/5 text-xs"
              style={{ letterSpacing: "0.14em" }}
            >
              أضف للسلة
            </button>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.6)" }}>
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-2"
              style={{ background: "var(--fg)", color: "var(--bg)", letterSpacing: "0.18em" }}>
              نفد المخزون
            </span>
          </div>
        )}
      </div>

      {/* content — minimal, Kylie-style */}
      <div className="pt-3 pb-4 px-1 flex flex-col gap-1">
        <h3 className="text-sm font-bold leading-snug line-clamp-2" style={{ color: "var(--fg)", letterSpacing: "0.01em" }}>
          {product.title}
        </h3>
        <span className="text-sm font-bold mt-1" style={{ color: "var(--fg-muted)" }}>
          {formatIQD(product.price)}
        </span>
      </div>
    </Link>
  );
}

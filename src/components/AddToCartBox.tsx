"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

export default function AddToCartBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAdd() {
    if (product.stock <= 0) return;
    addItem(
      { productId: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, stock: product.stock, deliveryFee: product.deliveryFee ?? 0 },
      qty
    );
    toast.success("تمت إضافة المنتج إلى السلة ✓");
    openCart();
  }

  return (
    <div className="flex items-center gap-3">
      {/* qty stepper */}
      <div
        className="flex items-center rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
      >
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-11 h-11 flex items-center justify-center text-xl font-light transition-colors hover:opacity-50"
          style={{ color: "var(--fg)" }}
        >−</button>
        <span className="w-9 text-center font-bold" style={{ color: "var(--fg)" }}>{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          disabled={qty >= product.stock}
          className="w-11 h-11 flex items-center justify-center text-xl font-light transition-colors hover:opacity-50 disabled:opacity-25"
          style={{ color: "var(--fg)" }}
        >+</button>
      </div>

      {/* add to cart */}
      <button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className="btn-primary flex-1 py-3 rounded-xl text-sm"
      >
        {product.stock <= 0 ? "غير متوفر حالياً" : "أضف إلى السلة"}
      </button>
    </div>
  );
}

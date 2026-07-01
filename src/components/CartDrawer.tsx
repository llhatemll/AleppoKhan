"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatIQD } from "@/lib/constants";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCartStore();

  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-extrabold text-xl" style={{ color: "var(--fg)" }}>
            سلة المشتريات
          </h2>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors"
            style={{ background: "var(--bg)", color: "var(--fg)", border: "1px solid var(--border)" }}
          >✕</button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <span className="text-5xl">🛒</span>
              <p className="font-semibold" style={{ color: "var(--fg-muted)" }}>سلتك فارغة حالياً</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 rounded-xl"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: "#fff" }}>
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: "var(--fg)" }}>
                    {item.title}
                  </h3>
                  <span className="font-display font-bold text-sm" style={{ color: "var(--accent)" }}>
                    {formatIQD(item.price)}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg transition-colors hover:opacity-60"
                        style={{ color: "var(--fg)" }}
                      >−</button>
                      <span className="w-7 text-center text-sm font-bold" style={{ color: "var(--fg)" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-lg transition-colors hover:opacity-60 disabled:opacity-30"
                        style={{ color: "var(--fg)" }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs font-semibold hover:opacity-60 transition-colors"
                      style={{ color: "var(--fg-muted)" }}
                    >إزالة</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="p-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg" style={{ color: "var(--fg)" }}>الإجمالي</span>
              <span className="font-display font-extrabold text-xl" style={{ color: "var(--accent)" }}>
                {formatIQD(totalPrice())}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center py-3 rounded-xl text-base"
            >
              إتمام الطلب
            </Link>
            <p className="text-center text-xs" style={{ color: "var(--fg-faint)" }}>
              الدفع نقداً عند الاستلام
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useTheme, initTheme } from "@/store/theme";
import { CATEGORIES } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const { dark, toggle } = useTheme();

  useEffect(() => { initTheme(); }, []);

  return (
    <>
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ background: "var(--bg-nav)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 sm:h-18">

          {/* Logo */}
          <Link
            href="/"
            className="font-display font-extrabold text-xl sm:text-2xl"
            style={{ color: "var(--fg)" }}
          >
            حلب <span style={{ color: "var(--accent)" }}>خان</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="text-sm font-semibold transition-colors hover:opacity-60"
                style={{ color: "var(--fg)" }}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Dark / Light toggle */}
            <button
              onClick={toggle}
              aria-label={dark ? "وضع النهار" : "وضع الليل"}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              {dark ? (
                /* sun icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg)" }}>
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* moon icon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg)" }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="سلة المشتريات"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--fg)" }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent)" }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="القائمة"
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--fg)" }}>
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="font-display font-extrabold text-lg" style={{ color: "var(--fg)" }}>القائمة</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
          >✕</button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 font-semibold text-base rounded-lg px-3 hover:opacity-70" style={{ color: "var(--fg)", borderBottom: "1px solid var(--border)" }}>
            الرئيسية
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="py-3 font-semibold text-base rounded-lg px-3 hover:opacity-70"
              style={{ color: "var(--fg)", borderBottom: "1px solid var(--border)" }}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

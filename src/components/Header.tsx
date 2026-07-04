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
    <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "var(--bg-nav)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16 sm:h-20">

        {/* Logo */}
        <Link href="/" className="font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: "var(--fg)" }}>
          حلب خان
        </Link>

        {/* Desktop nav — centred */}
        <nav className="hidden md:flex items-center gap-8">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}
              className="text-sm font-bold tracking-wide transition-opacity hover:opacity-50"
              style={{ color: "var(--fg)", letterSpacing: "0.05em" }}>
              {c.label}
            </Link>
          ))}
          <Link href="/collections"
            className="text-sm font-bold tracking-wide transition-opacity hover:opacity-50"
            style={{ color: "var(--fg)", letterSpacing: "0.05em" }}>
            الكولكشنات
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark/Light */}
          <button onClick={toggle} aria-label="تبديل الوضع"
            className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: "var(--fg)" }}>
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Cart */}
          <button onClick={openCart} aria-label="السلة"
            className="relative w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: "var(--fg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "var(--accent2)", color: "#fff", fontSize: "10px" }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(true)} aria-label="القائمة"
            className="md:hidden w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: "var(--fg)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.5)" }} />
      <div className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--bg-card)" }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="font-display font-bold text-xl" style={{ color: "var(--fg)" }}>القائمة</span>
          <button onClick={() => setMenuOpen(false)} className="text-2xl leading-none" style={{ color: "var(--fg)" }}>×</button>
        </div>
        <nav className="flex flex-col p-4 gap-0">
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="py-4 font-bold text-base tracking-wide border-b"
            style={{ color: "var(--fg)", borderColor: "var(--border)" }}>الرئيسية</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}
              className="py-4 font-bold text-base tracking-wide border-b"
              style={{ color: "var(--fg)", borderColor: "var(--border)" }}>
              {c.label}
            </Link>
          ))}
          <Link href="/collections" onClick={() => setMenuOpen(false)}
            className="py-4 font-bold text-base tracking-wide border-b"
            style={{ color: "var(--fg)", borderColor: "var(--border)" }}>
            الكولكشنات
          </Link>
        </nav>
      </div>
    </header>
  );
}

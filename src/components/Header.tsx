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
        <Link href="/" aria-label="خان حلب" style={{ color: "var(--fg)", display: "flex", alignItems: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.53 111.02"
            style={{ height: "36px", width: "auto" }} fill="currentColor">
            <path d="M74.63,89.33l-10.07,10.07v1.54l10.07,10.07,9.97-9.97c.1-.1.1-1.65,0-1.75l-9.97-9.97Z"/>
            <path d="M245.88,46.16c-17.27,0-27.65-16.34-39.89-16.34-4.73,0-8.12,2.47-11.72,5.65l-4.73,11.82,1.03,1.13c2.67-.31,5.55-.82,8.02-.82,10.79,0,18.81,6.89,31.04,10.38-8.22,1.44-18.71,1.44-35.98,1.44h-3.7s-.07,0-.1,0h0c-8.74,0-10.49-.93-10.49-4.84V1.13h-2.06l-10.38,14.39,2.57,39.27c.1,1.23.21,2.47.31,3.6-2.98.93-5.65,1.03-8.53,1.03-.03,0-.06,0-.09,0h0c-8.12,0-13.47-2.89-13.98-10.49l-.41-6.48h-2.06l-2.16,8.74c-.41,1.75-.82,3.39-1.03,5.04-18.5,3.5-35.98,7.3-58.39,7.3-27.34,0-56.23-5.65-82.03-18.3l-1.13,1.75,15.11,22.51c17.99,8.74,38.04,12.54,61.68,12.54,26.73,0,45.95-4.83,59.11-9.46l5.14-12.95c-1.34,15.11,6.37,19.22,15.11,19.22.03,0,.06,0,.09,0h0c3.39,0,6.89-.92,9.35-3.69l4.63-13.77c1.75,12.13,6.27,17.48,14.6,17.48.04,0,.07,0,.1,0h0c9.25,0,16.24-2.46,24.57-9.55,3.29-2.78,10.38-9.35,23.64-9.35h12.54l4.63-12.23-.51-1.54h-3.91Z"/>
            <path d="M360.29,51.5c.1-.1.1-1.65,0-1.75l-9.97-9.97-10.07,10.07v1.54l10.07,10.07,9.97-9.97Z"/>
            <path d="M407.99,35.16h-2.06l-6.99,16.55c4.11,5.14,13.06,16.65,15.21,20.46-9.87,3.39-35.77,7.09-63.12,7.09-22.72,0-51.6-2.57-77.41-18.3l-1.13,1.75,15.11,22.51c17.99,8.74,38.04,12.54,61.68,12.54,26.73,0,47.8-4.83,60.86-9.25l4.93-14.39c2.06-6.17,3.39-11.82,2.67-17.78l2.57-6.07-12.34-15.11Z"/>
            <path d="M476.14,11.72c.1-.1.1-1.64,0-1.75l-9.97-9.97-10.07,10.07v1.54l10.07,10.07,9.97-9.97Z"/>
            <path d="M512.01,46.16h-3.91c-17.27,0-27.65-16.34-39.89-16.34-4.73,0-8.12,2.47-11.72,5.65l-4.73,11.82,1.03,1.13c2.67-.31,5.55-.82,8.02-.82,10.79,0,18.81,6.89,31.04,10.38-8.22,1.44-18.71,1.44-35.98,1.44h-3.7s-.07,0-.1,0h0c-8.74,0-10.49-.93-10.49-4.84V1.13h-2.06l-10.38,14.39,2.57,39.27c1.13,16.86,5.65,24.05,15.32,24.05.04,0,.07,0,.1,0h0c9.25,0,16.24-2.46,24.57-9.55,3.29-2.78,10.38-9.35,23.64-9.35h12.54l4.63-12.23-.51-1.54Z"/>
          </svg>
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

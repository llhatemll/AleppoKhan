import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display font-extrabold text-2xl mb-3" style={{ color: "var(--fg)" }}>
            حلب <span style={{ color: "var(--accent)" }}>خان</span>
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            منتجات طبيعية فاخرة من صابون وشامبو وزيوت، مصنوعة بعناية من أجود المكونات الطبيعية.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold mb-4 text-base" style={{ color: "var(--fg)" }}>الأقسام</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:opacity-60 transition-opacity" style={{ color: "var(--fg-muted)" }}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-4 text-base" style={{ color: "var(--fg)" }}>التوصيل والدفع</h4>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            الدفع عند الاستلام فقط.
            <br />
            التوصيل لجميع محافظات العراق.
          </p>
        </div>
      </div>
      <div className="py-4 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-faint)" }}>
        © {new Date().getFullYear()} حلب خان. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

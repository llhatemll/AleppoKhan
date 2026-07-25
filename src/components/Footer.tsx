import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const SOCIAL = [
  {
    name: "Instagram",
    href: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: "Messenger",
    href: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.4l3.131 3.26L19.752 8.4l-6.561 6.563z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-1">
          <Link href="/" aria-label="خان حلب" style={{ color: "var(--fg)", display: "inline-flex", marginBottom: "12px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.53 111.02"
              style={{ height: "28px", width: "auto" }} fill="currentColor">
              <path d="M74.63,89.33l-10.07,10.07v1.54l10.07,10.07,9.97-9.97c.1-.1.1-1.65,0-1.75l-9.97-9.97Z"/>
              <path d="M245.88,46.16c-17.27,0-27.65-16.34-39.89-16.34-4.73,0-8.12,2.47-11.72,5.65l-4.73,11.82,1.03,1.13c2.67-.31,5.55-.82,8.02-.82,10.79,0,18.81,6.89,31.04,10.38-8.22,1.44-18.71,1.44-35.98,1.44h-3.7s-.07,0-.1,0h0c-8.74,0-10.49-.93-10.49-4.84V1.13h-2.06l-10.38,14.39,2.57,39.27c.1,1.23.21,2.47.31,3.6-2.98.93-5.65,1.03-8.53,1.03-.03,0-.06,0-.09,0h0c-8.12,0-13.47-2.89-13.98-10.49l-.41-6.48h-2.06l-2.16,8.74c-.41,1.75-.82,3.39-1.03,5.04-18.5,3.5-35.98,7.3-58.39,7.3-27.34,0-56.23-5.65-82.03-18.3l-1.13,1.75,15.11,22.51c17.99,8.74,38.04,12.54,61.68,12.54,26.73,0,45.95-4.83,59.11-9.46l5.14-12.95c-1.34,15.11,6.37,19.22,15.11,19.22.03,0,.06,0,.09,0h0c3.39,0,6.89-.92,9.35-3.69l4.63-13.77c1.75,12.13,6.27,17.48,14.6,17.48.04,0,.07,0,.1,0h0c9.25,0,16.24-2.46,24.57-9.55,3.29-2.78,10.38-9.35,23.64-9.35h12.54l4.63-12.23-.51-1.54h-3.91Z"/>
              <path d="M360.29,51.5c.1-.1.1-1.65,0-1.75l-9.97-9.97-10.07,10.07v1.54l10.07,10.07,9.97-9.97Z"/>
              <path d="M407.99,35.16h-2.06l-6.99,16.55c4.11,5.14,13.06,16.65,15.21,20.46-9.87,3.39-35.77,7.09-63.12,7.09-22.72,0-51.6-2.57-77.41-18.3l-1.13,1.75,15.11,22.51c17.99,8.74,38.04,12.54,61.68,12.54,26.73,0,47.8-4.83,60.86-9.25l4.93-14.39c2.06-6.17,3.39-11.82,2.67-17.78l2.57-6.07-12.34-15.11Z"/>
              <path d="M476.14,11.72c.1-.1.1-1.64,0-1.75l-9.97-9.97-10.07,10.07v1.54l10.07,10.07,9.97-9.97Z"/>
              <path d="M512.01,46.16h-3.91c-17.27,0-27.65-16.34-39.89-16.34-4.73,0-8.12,2.47-11.72,5.65l-4.73,11.82,1.03,1.13c2.67-.31,5.55-.82,8.02-.82,10.79,0,18.81,6.89,31.04,10.38-8.22,1.44-18.71,1.44-35.98,1.44h-3.7s-.07,0-.1,0h0c-8.74,0-10.49-.93-10.49-4.84V1.13h-2.06l-10.38,14.39,2.57,39.27c1.13,16.86,5.65,24.05,15.32,24.05.04,0,.07,0,.1,0h0c9.25,0,16.24-2.46,24.57-9.55,3.29-2.78,10.38-9.35,23.64-9.35h12.54l4.63-12.23-.51-1.54Z"/>
            </svg>
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            منتجات طبيعية فاخرة من صابون وشامبو وزيوت، مصنوعة بعناية من أجود المكونات الطبيعية.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL.map((s) =>
              s.href ? (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-60"
                  style={{ border: "1px solid var(--border)", color: "var(--fg)" }}>
                  {s.icon}
                </a>
              ) : (
                <span key={s.name} aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center cursor-not-allowed opacity-40"
                  style={{ border: "1px solid var(--border)", color: "var(--fg)" }}>
                  {s.icon}
                </span>
              )
            )}
          </div>
        </div>

        {/* Categories */}
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
            <li>
              <Link href="/collections" className="hover:opacity-60 transition-opacity" style={{ color: "var(--fg-muted)" }}>
                البكجات
              </Link>
            </li>
          </ul>
        </div>

        {/* Delivery */}
        <div>
          <h4 className="font-display font-bold mb-4 text-base" style={{ color: "var(--fg)" }}>التوصيل والدفع</h4>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            الدفع عند الاستلام فقط.
            <br />
            التوصيل لجميع محافظات العراق.
          </p>
        </div>

        {/* Contact placeholder */}
        <div>
          <h4 className="font-display font-bold mb-4 text-base" style={{ color: "var(--fg)" }}>تواصل معنا</h4>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            تواصل معنا عبر وسائل التواصل الاجتماعي أو راسلنا مباشرة لأي استفسار.
          </p>
        </div>

      </div>
      <div className="py-4 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-faint)" }}>
        © {new Date().getFullYear()} خان حلب. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

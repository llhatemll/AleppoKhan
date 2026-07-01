import type { Metadata } from "next";
import { Cairo, Almarai } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "حلب خان | منتجات طبيعية فاخرة",
  description:
    "صابون وشامبو وزيوت طبيعية فاخرة. الدفع عند الاستلام في جميع محافظات العراق.",
};

/* prevents flash of wrong theme on first load */
const themeScript = `
  (function(){
    try {
      var t = localStorage.getItem('theme');
      if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e){}
  })()
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${almarai.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans" style={{ background: "var(--bg)", color: "var(--fg)" }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-cairo)",
              direction: "rtl",
              background: "var(--bg-card)",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow)",
            },
          }}
        />
      </body>
    </html>
  );
}

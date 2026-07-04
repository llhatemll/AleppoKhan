import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "خان حلب | منتجات طبيعية فاخرة",
  description: "صابون وشامبو وزيوت طبيعية فاخرة. الدفع عند الاستلام في جميع محافظات العراق.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function(){try{var t=localStorage.getItem('theme');
          if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))
          document.documentElement.classList.add('dark');}catch(e){}})()
        `}</Script>
      </head>
      <body style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'ThmanyahSans', sans-serif",
              direction: "rtl",
              background: "var(--bg-card)",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              borderRadius: "0px",
              boxShadow: "var(--shadow-md)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}

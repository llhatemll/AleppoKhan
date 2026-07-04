"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { ContentKey } from "@/lib/siteContent";

type Content = Record<ContentKey, string>;

async function save(key: ContentKey, value: string) {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  return res.ok;
}

async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) return null;
  const data = await res.json();
  return data.url as string;
}

/* ── small reusable field ── */
function TextField({
  label, hint, value, multiline = false,
  onChange, onSave, saving,
}: {
  label: string; hint?: string; value: string; multiline?: boolean;
  onChange: (v: string) => void; onSave: () => void; saving: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>{label}</label>
      {hint && <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{hint}</p>}
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-sm"
          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "inherit", resize: "vertical" }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-sm"
          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "inherit" }}
        />
      )}
      <button onClick={onSave} disabled={saving} className="btn-primary self-start text-sm px-5 py-2">
        {saving ? "جاري الحفظ..." : "حفظ"}
      </button>
    </div>
  );
}

/* ── image upload field ── */
function ImageField({
  label, hint, value, onChange,
}: {
  label: string; hint?: string; value: string; onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) { onChange(url); toast.success("تم رفع الصورة ✓"); }
    else toast.error("فشل رفع الصورة");
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>{label}</label>
      {hint && <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{hint}</p>}
      <div
        onClick={() => !uploading && ref.current?.click()}
        className="relative w-full cursor-pointer flex items-center justify-center overflow-hidden"
        style={{ height: 180, background: value ? "transparent" : "var(--bg-cream)", border: "2px dashed var(--border)" }}
      >
        {value ? (
          <>
            <Image src={value} alt={label} fill className="object-cover" unoptimized={value.startsWith("/uploads/")} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)" }}>
              <span className="text-white font-bold text-sm">تغيير الصورة</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: "var(--fg-muted)" }}>
            {uploading
              ? <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--fg)", borderTopColor: "transparent" }} />
              : <><span className="text-3xl">🖼️</span><span className="text-sm font-bold">اضغط لرفع صورة</span></>
            }
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ─────────────── Main editor ─────────────── */
export default function ContentEditor({ initial }: { initial: Content }) {
  const [c, setC] = useState<Content>(initial);
  const [saving, setSaving] = useState<Partial<Record<ContentKey, boolean>>>({});

  async function handleSave(key: ContentKey) {
    setSaving((s) => ({ ...s, [key]: true }));
    const ok = await save(key, c[key]);
    setSaving((s) => ({ ...s, [key]: false }));
    if (ok) toast.success("تم الحفظ ✓");
    else toast.error("حدث خطأ");
  }

  async function handleImageSave(key: ContentKey, url: string) {
    setC((prev) => ({ ...prev, [key]: url }));
    setSaving((s) => ({ ...s, [key]: true }));
    const ok = await save(key, url);
    setSaving((s) => ({ ...s, [key]: false }));
    if (!ok) toast.error("حدث خطأ في حفظ الصورة");
  }

  const section = (title: string) => (
    <h2 className="font-bold text-base pt-2 pb-1" style={{ color: "var(--fg)", borderBottom: "2px solid var(--fg)" }}>
      {title}
    </h2>
  );

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      {/* ── Announcement bar ── */}
      {section("شريط الإعلانات (أعلى الصفحة)")}

      <div className="flex items-center gap-3">
        <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>تفعيل الشريط</label>
        <button
          onClick={async () => {
            const next = c.announce_enabled === "true" ? "false" : "true";
            setC((p) => ({ ...p, announce_enabled: next }));
            await save("announce_enabled", next);
            toast.success("تم الحفظ ✓");
          }}
          className="px-4 py-2 text-sm font-bold transition-colors"
          style={{
            background: c.announce_enabled === "true" ? "var(--fg)" : "var(--bg-cream)",
            color: c.announce_enabled === "true" ? "var(--bg)" : "var(--fg)",
            border: "1px solid var(--border)",
          }}
        >
          {c.announce_enabled === "true" ? "✓ مفعّل" : "معطّل"}
        </button>
      </div>

      <TextField
        label="نص الإعلان"
        value={c.announce_text}
        onChange={(v) => setC((p) => ({ ...p, announce_text: v }))}
        onSave={() => handleSave("announce_text")}
        saving={!!saving.announce_text}
      />

      {/* ── Hero section ── */}
      {section("القسم الرئيسي (Hero)")}

      <ImageField
        label="صورة الخلفية الرئيسية"
        hint="الصورة الكبيرة خلف العنوان في الصفحة الرئيسية — يُفضل أن تكون أفقية وعالية الجودة"
        value={c.hero_image}
        onChange={(url) => handleImageSave("hero_image", url)}
      />

      <TextField
        label="العنوان الرئيسي"
        hint="العنوان الكبير. استخدم سطر جديد (Enter) لتقسيمه لسطرين"
        multiline
        value={c.hero_title}
        onChange={(v) => setC((p) => ({ ...p, hero_title: v }))}
        onSave={() => handleSave("hero_title")}
        saving={!!saving.hero_title}
      />

      <TextField
        label="النص الفرعي"
        value={c.hero_subtitle}
        onChange={(v) => setC((p) => ({ ...p, hero_subtitle: v }))}
        onSave={() => handleSave("hero_subtitle")}
        saving={!!saving.hero_subtitle}
      />

      <TextField
        label="نص زر التسوق"
        value={c.hero_btn_text}
        onChange={(v) => setC((p) => ({ ...p, hero_btn_text: v }))}
        onSave={() => handleSave("hero_btn_text")}
        saving={!!saving.hero_btn_text}
      />

      {/* ── Sections ── */}
      {section("عنوان قسم المنتجات")}

      <TextField
        label="عنوان قسم المنتجات المميزة"
        value={c.section_title}
        onChange={(v) => setC((p) => ({ ...p, section_title: v }))}
        onSave={() => handleSave("section_title")}
        saving={!!saving.section_title}
      />

      {/* ── Category banners ── */}
      {section("صور بطاقات التصنيفات")}

      <ImageField
        label="صورة تصنيف: الصابون"
        value={c.cat_image_soap}
        onChange={(url) => handleImageSave("cat_image_soap", url)}
      />
      <ImageField
        label="صورة تصنيف: الشامبو"
        value={c.cat_image_shampoo}
        onChange={(url) => handleImageSave("cat_image_shampoo", url)}
      />
      <ImageField
        label="صورة تصنيف: الزيوت"
        value={c.cat_image_oil}
        onChange={(url) => handleImageSave("cat_image_oil", url)}
      />

    </div>
  );
}

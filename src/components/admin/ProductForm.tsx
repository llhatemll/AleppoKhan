"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CATEGORIES, DELIVERY_FREE, DELIVERY_PAID, formatIQD } from "@/lib/constants";
import InputField from "@/components/InputField";
import type { Product } from "@/types";

type FormData = {
  title: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  images: string[];
  deliveryFee: number;
  featured: boolean;
  soldOut: boolean;
};

async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) { toast.error(data.error || "فشل رفع الصورة"); return null; }
  return data.url as string;
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const mainFileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? CATEGORIES[0].value,
    stock: product?.stock?.toString() ?? "0",
    imageUrl: product?.imageUrl ?? "",
    images: product?.images ?? [],
    deliveryFee: product?.deliveryFee ?? DELIVERY_FREE,
    featured: product?.featured ?? false,
    soldOut: product?.soldOut ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (url) { setForm((p) => ({ ...p, imageUrl: url })); toast.success("تم رفع الصورة الرئيسية ✓"); }
  }

  async function handleExtraImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingExtra(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setUploadingExtra(false);
    if (urls.length) { setForm((p) => ({ ...p, images: [...p.images, ...urls] })); toast.success(`تم رفع ${urls.length} صورة ✓`); }
  }

  function removeExtraImage(idx: number) {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) { toast.error("الرجاء رفع الصورة الرئيسية أولاً"); return; }
    setSaving(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title, description: form.description,
          price: Number(form.price), category: form.category, stock: Number(form.stock),
          imageUrl: form.imageUrl, images: form.images,
          deliveryFee: form.deliveryFee, featured: form.featured, soldOut: form.soldOut,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "حدث خطأ"); setSaving(false); return; }
      toast.success(product ? "تم تحديث المنتج ✓" : "تم إضافة المنتج ✓");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في الاتصال");
      setSaving(false);
    }
  }

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className="px-4 py-1.5 text-xs font-bold transition-colors"
        style={{ background: value ? "var(--fg)" : "var(--bg-cream)", color: value ? "var(--bg)" : "var(--fg)", border: "1px solid var(--border)" }}>
        {value ? "✓ مفعّل" : "معطّل"}
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">

      {/* Main image */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>الصورة الرئيسية <span style={{ color: "#ef4444" }}>*</span></span>
        <div onClick={() => !uploading && mainFileRef.current?.click()}
          className="relative w-full overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3"
          style={{ aspectRatio: "4/3", background: form.imageUrl ? "transparent" : "var(--bg-cream)", border: "2px dashed var(--border)" }}>
          {form.imageUrl ? (
            <>
              <Image src={form.imageUrl} alt="صورة المنتج" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)" }}>
                <span className="text-white font-bold text-sm">تغيير الصورة</span>
              </div>
            </>
          ) : uploading ? (
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--fg)", borderTopColor: "transparent" }} />
          ) : (
            <div className="text-center flex flex-col items-center gap-2" style={{ color: "var(--fg-muted)" }}>
              <span className="text-3xl">📷</span>
              <p className="font-bold text-sm">اضغط لرفع الصورة الرئيسية</p>
              <p className="text-xs">JPG أو PNG أو WebP حتى 10MB</p>
            </div>
          )}
        </div>
        <input ref={mainFileRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
      </div>

      {/* Extra images */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>صور إضافية (اختياري)</span>
        <div className="flex flex-wrap gap-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <Image src={img} alt="" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => removeExtraImage(idx)}
                className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                style={{ background: "#ef4444", color: "#fff" }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={() => extraFileRef.current?.click()}
            className="w-20 h-20 flex flex-col items-center justify-center gap-1 text-xs font-bold"
            style={{ border: "2px dashed var(--border)", color: "var(--fg-muted)", background: "var(--bg-cream)" }}>
            {uploadingExtra ? <span className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--fg)", borderTopColor: "transparent" }} /> : <><span className="text-xl">+</span><span>إضافة</span></>}
          </button>
        </div>
        <input ref={extraFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImage} />
      </div>

      <InputField label="اسم المنتج" required value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: صابون الغار الحلبي" />
      <InputField label="الوصف" as="textarea" rows={4} required value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف تفصيلي للمنتج..." />

      <div className="grid grid-cols-2 gap-4">
        <InputField label="السعر (د.ع)" type="number" min={0} required value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="مثال: 7000" />
        <InputField label="الكمية المتوفرة" type="number" min={0} required value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="مثال: 50" />
      </div>

      <InputField label="التصنيف" as="select" required value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </InputField>

      {/* Delivery fee */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>رسوم التوصيل</span>
        <div className="flex gap-2">
          {[{ label: "توصيل مجاني", value: DELIVERY_FREE }, { label: `${formatIQD(DELIVERY_PAID)} رسوم توصيل`, value: DELIVERY_PAID }].map((opt) => (
            <button key={opt.value} type="button" onClick={() => setForm({ ...form, deliveryFee: opt.value })}
              className="flex-1 py-2.5 text-sm font-bold transition-colors"
              style={{ background: form.deliveryFee === opt.value ? "var(--fg)" : "var(--bg-cream)", color: form.deliveryFee === opt.value ? "var(--bg)" : "var(--fg)", border: "1px solid var(--border)" }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Toggle label="منتج مميز (يظهر في قسم المنتجات المميزة)" value={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
      <Toggle label="نفاد المخزون (يظهر كـ نفد المخزون)" value={form.soldOut} onChange={(v) => setForm({ ...form, soldOut: v })} />

      <button type="submit" disabled={saving || uploading || uploadingExtra} className="btn-primary py-4 text-base w-full">
        {saving ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}

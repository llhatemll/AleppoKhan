"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CATEGORIES } from "@/lib/constants";
import InputField from "@/components/InputField";
import type { Product } from "@/types";

type ProductFormData = {
  title: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? CATEGORIES[0].value,
    stock: product?.stock?.toString() ?? "0",
    imageUrl: product?.imageUrl ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ── image upload ── */
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "فشل رفع الصورة");
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("تم رفع الصورة بنجاح ✓");
    } catch {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  /* ── save product ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.imageUrl) {
      toast.error("الرجاء رفع صورة للمنتج أولاً");
      return;
    }

    setSaving(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          imageUrl: form.imageUrl,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "حدث خطأ");
        setSaving(false);
        return;
      }
      toast.success(product ? "تم تحديث المنتج ✓" : "تم إضافة المنتج ✓");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في الاتصال");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">

      {/* ── Image upload ── */}
      <div className="flex flex-col gap-2">
        <span className="font-bold text-sm" style={{ color: "var(--fg)" }}>
          صورة المنتج <span style={{ color: "var(--accent)" }}>*</span>
        </span>

        {/* preview box */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors"
          style={{
            aspectRatio: "16/9",
            background: form.imageUrl ? "transparent" : "var(--bg)",
            border: `2px dashed var(--border)`,
          }}
        >
          {form.imageUrl ? (
            <>
              <Image
                src={form.imageUrl}
                alt="صورة المنتج"
                fill
                className="object-cover"
                unoptimized={form.imageUrl.startsWith("/uploads/")}
              />
              {/* overlay on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <span className="text-white font-bold text-sm">تغيير الصورة</span>
              </div>
            </>
          ) : (
            <>
              {uploading ? (
                <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    📷
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm" style={{ color: "var(--fg)" }}>اضغط هنا لرفع صورة</p>
                    <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>JPG أو PNG أو WebP — حتى 5 ميغابايت</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* re-upload button (shown after image selected) */}
        {form.imageUrl && !uploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-center py-2 rounded-xl transition-colors"
            style={{ color: "var(--accent)", border: "1px solid var(--border)", background: "var(--bg)" }}
          >
            {uploading ? "جاري الرفع..." : "تغيير الصورة"}
          </button>
        )}
      </div>

      {/* ── Text fields ── */}
      <InputField
        label="اسم المنتج"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="مثال: صابون الغار الحلبي"
      />
      <InputField
        label="الوصف"
        as="textarea"
        rows={4}
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="وصف تفصيلي للمنتج..."
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="السعر (د.ع)"
          type="number"
          min={0}
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="مثال: 7000"
        />
        <InputField
          label="الكمية المتوفرة"
          type="number"
          min={0}
          required
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="مثال: 50"
        />
      </div>
      <InputField
        label="التصنيف"
        as="select"
        required
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </InputField>

      <button
        type="submit"
        disabled={saving || uploading}
        className="btn-primary py-4 rounded-xl text-base"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--btn-fg)", borderTopColor: "transparent" }} />
            جاري الحفظ...
          </span>
        ) : product ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}

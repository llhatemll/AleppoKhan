"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatIQD } from "@/lib/constants";

type Product = { id: string; title: string; price: number; imageUrl: string };

interface CollectionItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface Props {
  products: Product[];
  initial?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    active: boolean;
    items: CollectionItem[];
  };
}

export default function CollectionForm({ products, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [items, setItems] = useState<{ productId: string; quantity: number; product: Product }[]>(
    initial?.items ?? []
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) { toast.error("فشل رفع الصورة"); return; }
    const data = await res.json();
    setImageUrl(data.url);
    toast.success("تم رفع الصورة ✓");
  }

  function addProduct(productId: string) {
    if (items.find((i) => i.productId === productId)) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) => [...prev, { productId, quantity: 1, product }]);
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function setQty(productId: string, qty: number) {
    setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("العنوان مطلوب"); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { toast.error("السعر غير صحيح"); return; }

    setSaving(true);
    const url = isEdit ? `/api/admin/collections/${initial!.id}` : "/api/admin/collections";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, imageUrl, price: Number(price), active,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });
    setSaving(false);
    if (!res.ok) { toast.error("حدث خطأ"); return; }
    toast.success(isEdit ? "تم الحفظ ✓" : "تم الإنشاء ✓");
    router.push("/admin/collections");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا الكولكشن؟")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/collections/${initial!.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) { toast.error("فشل الحذف"); return; }
    toast.success("تم الحذف");
    router.push("/admin/collections");
    router.refresh();
  }

  const availableProducts = products.filter((p) => !items.find((i) => i.productId === p.id));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">

      {/* Basic info */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>اسم الكولكشن *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required
            placeholder="مثال: كولكشن صحة الشعر"
            className="w-full px-4 py-3 text-sm"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "inherit" }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>الوصف</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            placeholder="وصف مختصر للكولكشن..."
            className="w-full px-4 py-3 text-sm"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "inherit", resize: "vertical" }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>السعر الإجمالي (د.ع) *</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" min="1"
            placeholder="مثال: 45000"
            className="w-full px-4 py-3 text-sm"
            dir="ltr"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)", fontFamily: "inherit" }} />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>صورة الكولكشن</label>
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="relative w-full cursor-pointer flex items-center justify-center overflow-hidden"
            style={{ height: 180, background: imageUrl ? "transparent" : "var(--bg-cream)", border: "2px dashed var(--border)" }}>
            {imageUrl ? (
              <>
                <Image src={imageUrl} alt="preview" fill className="object-cover" unoptimized={imageUrl.startsWith("/uploads/")} />
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
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <label className="font-bold text-sm" style={{ color: "var(--fg)" }}>الحالة</label>
          <button type="button" onClick={() => setActive((v) => !v)}
            className="px-4 py-2 text-sm font-bold transition-colors"
            style={{
              background: active ? "var(--fg)" : "var(--bg-cream)",
              color: active ? "var(--bg)" : "var(--fg)",
              border: "1px solid var(--border)",
            }}>
            {active ? "✓ نشط (يظهر للزوار)" : "مخفي"}
          </button>
        </div>
      </div>

      {/* Products in collection */}
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-base" style={{ color: "var(--fg)", borderBottom: "2px solid var(--fg)", paddingBottom: "6px" }}>
          المنتجات في الكولكشن
        </h2>

        {items.length === 0 && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>لم تضف أي منتجات بعد</p>
        )}

        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 p-3"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span className="font-bold text-sm line-clamp-1" style={{ color: "var(--fg)" }}>{item.product.title}</span>
              <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{formatIQD(item.product.price)}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-bold" style={{ color: "var(--fg-muted)" }}>الكمية:</label>
              <input type="number" min="1" value={item.quantity}
                onChange={(e) => setQty(item.productId, Number(e.target.value))}
                className="w-14 px-2 py-1 text-sm text-center"
                dir="ltr"
                style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)" }} />
            </div>
            <button type="button" onClick={() => removeItem(item.productId)}
              className="text-xs font-bold hover:opacity-60 transition-opacity px-2"
              style={{ color: "var(--fg-muted)" }}>
              ✕
            </button>
          </div>
        ))}

        {/* Add product selector */}
        {availableProducts.length > 0 && (
          <select
            defaultValue=""
            onChange={(e) => { if (e.target.value) { addProduct(e.target.value); e.target.value = ""; } }}
            className="w-full px-4 py-3 text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)", fontFamily: "inherit" }}>
            <option value="" disabled>+ أضف منتجاً للكولكشن</option>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.title} — {formatIQD(p.price)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
          {saving ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء الكولكشن"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="px-6 py-3 text-sm font-bold transition-opacity hover:opacity-70"
            style={{ border: "1px solid #ef4444", color: "#ef4444" }}>
            {deleting ? "جاري الحذف..." : "حذف الكولكشن"}
          </button>
        )}
      </div>
    </form>
  );
}

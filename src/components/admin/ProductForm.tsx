"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [form, setForm] = useState<ProductFormData>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? CATEGORIES[0].value,
    stock: product?.stock?.toString() ?? "0",
    imageUrl: product?.imageUrl ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
        setLoading(false);
        return;
      }
      toast.success(product ? "تم تحديث المنتج" : "تم إضافة المنتج");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في الاتصال");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <InputField
        label="اسم المنتج"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <InputField
        label="الوصف"
        as="textarea"
        rows={4}
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="السعر (د.ع)"
          type="number"
          min={0}
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <InputField
          label="الكمية المتوفرة"
          type="number"
          min={0}
          required
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
      <InputField
        label="رابط الصورة"
        required
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        placeholder="https://..."
        dir="ltr"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-ink text-paper font-bold py-3 hover:bg-clay transition-colors disabled:opacity-50"
      >
        {loading ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}

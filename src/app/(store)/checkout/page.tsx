"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { GOVERNORATES, formatIQD } from "@/lib/constants";
import InputField from "@/components/InputField";

const IRAQI_PHONE_REGEX = /^(?:\+?964|0)?7\d{9}$/;

type FormState = {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    governorate: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (form.fullName.trim().length < 3) next.fullName = "الرجاء إدخال الاسم الكامل";
    if (!IRAQI_PHONE_REGEX.test(form.phone.replace(/\s|-/g, "")))
      next.phone = "رقم هاتف عراقي غير صحيح (مثال: 07xxxxxxxxx)";
    if (!form.governorate) next.governorate = "الرجاء اختيار المحافظة";
    if (form.address.trim().length < 5) next.address = "الرجاء إدخال عنوان كامل وواضح";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("سلتك فارغة");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "حدث خطأ، حاول مرة أخرى");
        setSubmitting(false);
        return;
      }
      setOrderId(data.id);
      setOrderTotal(data.total);
      clearCart();
    } catch {
      toast.error("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-forest text-paper flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h1 className="font-display font-extrabold text-3xl mb-3">تم استلام طلبك بنجاح!</h1>
        <p className="text-ink/70 mb-6 leading-relaxed">
          رقم طلبك هو <span className="font-bold text-clay">#{orderId.slice(-8).toUpperCase()}</span>
          <br />
          سيتم التواصل معك قريباً لتأكيد التوصيل. الدفع سيكون عند الاستلام.
        </p>
        <div className="border border-ink p-4 inline-block mb-8 font-bold">
          إجمالي الطلب: <span className="text-clay">{formatIQD(orderTotal)}</span>
        </div>
        <div>
          <button
            onClick={() => router.push("/")}
            className="bg-ink text-paper font-bold px-8 py-3 hover:bg-clay transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-3xl mb-8 border-b border-ink pb-4">
        إتمام الطلب
      </h1>

      {items.length === 0 ? (
        <p className="text-ink/50 py-20 text-center">سلتك فارغة، أضف منتجات أولاً</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="md:col-span-2 flex flex-col gap-5">
            <InputField
              label="الاسم الكامل"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              error={errors.fullName}
              placeholder="مثال: أحمد محمد"
            />
            <InputField
              label="رقم الهاتف"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={errors.phone}
              placeholder="07xxxxxxxxx"
              type="tel"
              dir="ltr"
            />
            <InputField
              label="المحافظة"
              as="select"
              required
              value={form.governorate}
              onChange={(e) => setForm({ ...form, governorate: e.target.value })}
              error={errors.governorate}
            >
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </InputField>
            <InputField
              label="العنوان الكامل / أقرب نقطة دالة"
              required
              as="textarea"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              error={errors.address}
              placeholder="مثال: حي الجامعة، قرب مسجد..."
            />
            <InputField
              label="ملاحظات الطلب (اختياري)"
              as="textarea"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-paper font-bold py-4 hover:bg-clay transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin" />
                  جاري إرسال الطلب...
                </>
              ) : (
                "تأكيد الطلب (الدفع عند الاستلام)"
              )}
            </button>
          </form>

          <div className="border border-ink p-5 h-fit flex flex-col gap-4">
            <h2 className="font-display font-bold text-lg border-b border-ink pb-3">
              ملخص الطلب
            </h2>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-bold">{formatIQD(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-display font-bold text-lg border-t border-ink pt-3">
              <span>الإجمالي</span>
              <span className="text-clay">{formatIQD(totalPrice())}</span>
            </div>
            <p className="text-xs text-ink/50">الدفع نقداً عند استلام الطلب</p>
          </div>
        </div>
      )}
    </div>
  );
}

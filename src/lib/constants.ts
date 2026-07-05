export const CATEGORIES = [
  { slug: "soap", value: "SOAP", label: "الصابون" },
  { slug: "shampoo", value: "SHAMPOO", label: "الشامبو" },
  { slug: "oil", value: "OIL", label: "الزيوت الطبيعية" },
  { slug: "cleaner", value: "CLEANER", label: "منظفات منزلية" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function categorySlugToValue(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.value;
}

export function categoryValueToSlug(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.slug ?? value.toLowerCase();
}

export const GOVERNORATES = [
  "بغداد",
  "البصرة",
  "نينوى",
  "أربيل",
  "السليمانية",
  "دهوك",
  "كركوك",
  "النجف",
  "كربلاء",
  "بابل",
  "واسط",
  "ميسان",
  "ذي قار",
  "المثنى",
  "القادسية",
  "الانبار",
  "صلاح الدين",
  "ديالى",
] as const;

export const ORDER_STATUSES = [
  { value: "PENDING", label: "قيد الانتظار" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التوصيل" },
  { value: "CANCELED", label: "ملغي" },
] as const;

export function statusLabel(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function formatIQD(amount: number) {
  return `${amount.toLocaleString("ar-IQ")} د.ع`;
}

export const DELIVERY_FREE = 0;
export const DELIVERY_PAID = 5000;

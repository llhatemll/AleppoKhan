import { prisma } from "@/lib/prisma";

export type ContentKey =
  | "announce_enabled"
  | "announce_text"
  | "hero_title"
  | "hero_subtitle"
  | "hero_btn_text"
  | "hero_image"
  | "section_title"
  | "cat_image_soap"
  | "cat_image_shampoo"
  | "cat_image_oil";

const DEFAULTS: Record<ContentKey, string> = {
  announce_enabled: "true",
  announce_text: "🌿 الشحن مجاني لجميع محافظات العراق عند الطلب",
  hero_title: "جمال طبيعي\nمن خان حلب",
  hero_subtitle: "صابون وشامبو وزيوت طبيعية فاخرة، مصنوعة بعناية من أجود المكونات. الدفع عند الاستلام.",
  hero_btn_text: "تسوق الآن",
  hero_image: "",
  section_title: "منتجات مميزة",
  cat_image_soap: "",
  cat_image_shampoo: "",
  cat_image_oil: "",
};

export async function getContent(): Promise<Record<ContentKey, string>> {
  const rows = await prisma.siteContent.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  const result = {} as Record<ContentKey, string>;
  for (const key of Object.keys(DEFAULTS) as ContentKey[]) {
    result[key] = map[key] ?? DEFAULTS[key];
  }
  return result;
}

export async function setContent(key: ContentKey, value: string) {
  return prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  { title: "صابون الغار الحلبي", description: "صابون طبيعي مصنوع من زيت الغار وزيت الزيتون البكر، مثالي للبشرة الحساسة ويمنحها نضارة طبيعية.", price: 7000, category: "SOAP", stock: 50, imageUrl: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800" },
  { title: "صابون الفحم النشط", description: "ينظف البشرة بعمق ويزيل السموم والشوائب، مناسب للبشرة الدهنية.", price: 6000, category: "SOAP", stock: 40, imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800" },
  { title: "صابون الورد الطبيعي", description: "بخلاصة بتلات الورد الطبيعية، يمنح البشرة رائحة فاخرة ونعومة فائقة.", price: 6500, category: "SOAP", stock: 35, imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800" },
  { title: "شامبو الزيوت الطبيعية للشعر الجاف", description: "تركيبة غنية بزيت الأرغان وجوز الهند لترطيب الشعر الجاف والتالف.", price: 12000, category: "SHAMPOO", stock: 30, imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800" },
  { title: "شامبو لتقوية الشعر ومنع التساقط", description: "يحتوي على زيت الخروع والروزماري لتحفيز نمو الشعر وتقوية بصيلاته.", price: 13000, category: "SHAMPOO", stock: 25, imageUrl: "https://images.unsplash.com/photo-1626954079673-9956c701e803?w=800" },
  { title: "شامبو طبيعي خالٍ من السلفات", description: "تنظيف لطيف للشعر والفروة دون مواد كيميائية قاسية، مناسب للاستخدام اليومي.", price: 11000, category: "SHAMPOO", stock: 20, imageUrl: "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?w=800" },
  { title: "زيت الأرغان المغربي الأصلي", description: "زيت نقي 100% للبشرة والشعر، غني بفيتامين E ومضادات الأكسدة.", price: 18000, category: "OIL", stock: 30, imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800" },
  { title: "زيت جوز الهند البكر", description: "مرطب طبيعي متعدد الاستخدامات للبشرة والشعر، يمتاز برائحته العطرة الخفيفة.", price: 9000, category: "OIL", stock: 45, imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800" },
  { title: "زيت إكليل الجبل لتحفيز نمو الشعر", description: "يدعم فروة الرأس الصحية ويحفز بصيلات الشعر للنمو بشكل طبيعي.", price: 10000, category: "OIL", stock: 28, imageUrl: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=800" },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin123", 10);
  await prisma.admin.create({
    data: { username: process.env.ADMIN_USERNAME ?? "admin", password: hashed },
  });

  console.log("✓ تم إضافة البيانات بنجاح");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

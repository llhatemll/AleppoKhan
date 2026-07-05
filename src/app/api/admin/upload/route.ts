import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "رفع الصور غير مُفعَّل بعد — أضف Cloudinary credentials في Vercel ثم أعد النشر" },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "لم يتم اختيار صورة" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "صيغة الصورة غير مدعومة (JPG, PNG, WebP)" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "حجم الصورة كبير جداً، الحد 10MB" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "aleppo-khan", resource_type: "image" },
        (err, res) => { if (err || !res) reject(err ?? new Error("upload failed")); else resolve(res); }
      ).end(buffer);
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "خطأ غير معروف";
    return NextResponse.json({ error: `فشل رفع الصورة: ${msg}` }, { status: 500 });
  }
}

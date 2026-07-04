import { getContent } from "@/lib/siteContent";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getContent();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--fg)" }}>
        تعديل محتوى الموقع
      </h1>
      <ContentEditor initial={content} />
    </div>
  );
}

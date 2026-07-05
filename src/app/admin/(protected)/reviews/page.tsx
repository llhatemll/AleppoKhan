import { prisma } from "@/lib/prisma";
import AdminReviewsTable from "@/components/admin/AdminReviewsTable";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { title: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--fg)" }}>التقييمات</h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
          {reviews.filter((r) => !r.approved).length} بانتظار الموافقة · {reviews.filter((r) => r.approved).length} معتمد
        </p>
      </div>
      <AdminReviewsTable reviews={reviews as (typeof reviews[0] & { product: { title: string } })[]} />
    </div>
  );
}

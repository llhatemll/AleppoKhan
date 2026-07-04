import { prisma } from "@/lib/prisma";
import CollectionForm from "@/components/admin/CollectionForm";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  const products = await prisma.product.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--fg)" }}>
        كولكشن جديد
      </h1>
      <CollectionForm products={products} />
    </div>
  );
}

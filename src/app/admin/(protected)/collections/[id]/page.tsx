import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CollectionForm from "@/components/admin/CollectionForm";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collection, products] = await Promise.all([
    prisma.collection.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    }),
    prisma.product.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!collection) notFound();

  const initial = {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    imageUrl: collection.imageUrl,
    price: collection.price,
    active: collection.active,
    items: collection.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
    })),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--fg)" }}>
        تعديل: {collection.title}
      </h1>
      <CollectionForm products={products} initial={initial} />
    </div>
  );
}

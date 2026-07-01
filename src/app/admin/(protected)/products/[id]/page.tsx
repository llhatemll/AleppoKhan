import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl">تعديل المنتج</h1>
      <ProductForm product={product} />
    </div>
  );
}

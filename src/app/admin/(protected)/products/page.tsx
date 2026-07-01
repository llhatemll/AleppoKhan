import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink text-paper font-bold px-5 py-3 hover:bg-clay transition-colors"
        >
          + إضافة منتج
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}

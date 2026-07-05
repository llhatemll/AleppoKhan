"use client";

import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";

interface CollectionItem {
  productId: string;
  quantity: number;
  product: { id: string; title: string; price: number; imageUrl: string; stock: number };
}

interface Props {
  collection: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    items: CollectionItem[];
  };
}

export default function CollectionAddButton({ collection }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAdd() {
    let anyOutOfStock = false;
    for (const item of collection.items) {
      if (item.product.stock < item.quantity) {
        anyOutOfStock = true;
        break;
      }
    }
    if (anyOutOfStock) {
      toast.error("بعض منتجات هذا الكولكشن غير متوفرة حالياً");
      return;
    }
    for (const item of collection.items) {
      addItem(
        {
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          stock: item.product.stock,
          deliveryFee: 0,
        },
        item.quantity
      );
    }
    toast.success(`تمت إضافة كولكشن "${collection.title}" إلى السلة ✓`);
    openCart();
  }

  return (
    <button onClick={handleAdd} className="btn-primary text-sm px-6 py-3">
      أضف الكولكشن للسلة
    </button>
  );
}

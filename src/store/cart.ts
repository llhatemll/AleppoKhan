import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  totalDelivery: () => number;
  grandTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, existing.stock);
            return { items: state.items.map((i) => i.productId === item.productId ? { ...i, quantity: nextQty } : i) };
          }
          return { items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)
            .filter((i) => i.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
      // delivery: flat 5000 IQD per order if ANY item has a delivery fee
      totalDelivery: () =>
        get().items.some((i) => (i.deliveryFee ?? 0) > 0) ? 5000 : 0,
      grandTotal: () => get().totalPrice() + get().totalDelivery(),
    }),
    { name: "aleppo-khan-cart" }
  )
);

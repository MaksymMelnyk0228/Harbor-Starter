import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "../types";

interface CartState {
  items: CartLine[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        const existing = get().items.find((item) => item.productId === product.id);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.inventory?.quantity ?? 99) }
                : item
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              unitPrice: product.price,
              quantity,
              categorySlug: product.category.slug,
              stock: product.inventory?.quantity ?? 0,
              ratingAvg: product.ratingAvg,
              imageUrl: product.images[0]?.url,
            },
          ],
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((item) => item.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "harbor-cart" }
  )
);

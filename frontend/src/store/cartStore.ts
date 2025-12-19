import { create } from "zustand";
import type { CartItem } from "@/api/cart";
import {
  addCartItem,
  clearCart,
  decreaseCartItem,
  deleteCartItem,
  fetchCart
} from "@/api/cart";

type CartState = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initCart: () => Promise<void>;
  addDish: (dishId: number) => Promise<void>;
  addSetmeal: (setmealId: number) => Promise<void>;
  // decreaseDish for Homepage interaction (using dishId to find item)
  decreaseDish: (dishId: number) => Promise<void>; 
  decreaseSetmeal: (setmealId: number) => Promise<void>;
  decreaseItem: (itemId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearAll: () => Promise<void>;
};

const calcTotals = (items: CartItem[]) => {
  const totalCount = items.reduce((acc, item) => acc + item.number, 0);
  // amount assumed to be unit price
  const totalAmount = items.reduce((acc, item) => acc + item.amount * item.number, 0);
  return { totalCount, totalAmount };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  initialized: false,

  initCart: async () => {
    // Always fetch to ensure sync
    set({ loading: true, error: null });
    try {
      const items = await fetchCart();
      set({ items, initialized: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load cart";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  addDish: async (dishId: number) => {
    const prevItems = get().items;
    const existing = prevItems.find(
      (i) => i.dishId === dishId && i.setmealId == null
    );
    let optimisticItems: CartItem[];
    
    // Optimistic Update
    if (existing) {
      optimisticItems = prevItems.map((i) =>
        i.id === existing.id
          ? { ...i, number: i.number + 1 }
          : i
      );
    } else {
      // Create temp item
      const tempId = Date.now() * -1;
      optimisticItems = [
        ...prevItems,
        {
          id: tempId,
          dishId,
          setmealId: null,
          name: "", // Will be filled by server response
          image: "",
          number: 1,
          amount: 0 // Will be filled by server response
        }
      ];
    }
    set({ items: optimisticItems });

    try {
      const serverItem = await addCartItem({ dishId });
      // Reload entire cart to ensure consistency (prices, discounts, etc)
      // Ideally we just replace the item, but fetching all is safer for "Total Price" consistency
      const allItems = await fetchCart();
      set({ items: allItems });
    } catch (err) {
      set({ items: prevItems }); // Rollback
      throw err;
    }
  },

  addSetmeal: async (setmealId: number) => {
    const prevItems = get().items;
    const existing = prevItems.find((i) => i.setmealId === setmealId);
    let optimisticItems: CartItem[];

    if (existing) {
      optimisticItems = prevItems.map((i) =>
        i.id === existing.id ? { ...i, number: i.number + 1 } : i
      );
    } else {
      const tempId = Date.now() * -1;
      optimisticItems = [
        ...prevItems,
        {
          id: tempId,
          dishId: null,
          setmealId,
          name: "",
          image: "",
          number: 1,
          amount: 0
        }
      ];
    }
    set({ items: optimisticItems });

    try {
      await addCartItem({ setmealId });
      const allItems = await fetchCart();
      set({ items: allItems });
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  decreaseDish: async (dishId: number) => {
    const item = get().items.find(i => i.dishId === dishId);
    if (!item) return;
    await get().decreaseItem(item.id);
  },

  decreaseSetmeal: async (setmealId: number) => {
    const item = get().items.find(i => i.setmealId === setmealId);
    if (!item) return;
    await get().decreaseItem(item.id);
  },

  decreaseItem: async (itemId: number) => {
    const prevItems = get().items;
    const existing = prevItems.find((i) => i.id === itemId);
    if (!existing) return;

    let optimisticItems: CartItem[];
    if (existing.number <= 1) {
      optimisticItems = prevItems.filter((i) => i.id !== itemId);
    } else {
      optimisticItems = prevItems.map((i) =>
        i.id === itemId
          ? { ...i, number: i.number - 1 }
          : i
      );
    }
    set({ items: optimisticItems });

    try {
      if (existing.number <= 1) {
         // If reducing from 1 to 0, use delete API or decrease API (depending on backend logic)
         // Assuming decrease API handles removal or we call delete explicitly
         // Standard: usually separate delete endpoint for removal, but let's try decrease first
         // Actually, most backends remove item if count becomes 0 on decrease.
         // Let's use decrease endpoint.
         await decreaseCartItem(itemId);
      } else {
         await decreaseCartItem(itemId);
      }
      // Re-sync
      const allItems = await fetchCart();
      set({ items: allItems });
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  removeItem: async (itemId: number) => {
    const prevItems = get().items;
    set({ items: prevItems.filter((i) => i.id !== itemId) });
    try {
      await deleteCartItem(itemId);
      const allItems = await fetchCart();
      set({ items: allItems });
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  clearAll: async () => {
    const prevItems = get().items;
    set({ items: [] });
    try {
      await clearCart();
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  }
}));

export const useCartSummary = () => {
  const items = useCartStore((state) => state.items);
  return calcTotals(items);
};

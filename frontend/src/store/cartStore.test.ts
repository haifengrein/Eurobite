import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCartStore } from "./cartStore";
import type { CartItem } from "@/api/cart";

vi.mock("@/api/cart", () => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  clearCart: vi.fn(),
  decreaseCartItem: vi.fn(),
  deleteCartItem: vi.fn()
}));

import {
  fetchCart,
  addCartItem,
  clearCart,
  decreaseCartItem,
  deleteCartItem
} from "@/api/cart";

const fetchCartMock = fetchCart as unknown as ReturnType<typeof vi.fn>;
const addCartItemMock = addCartItem as unknown as ReturnType<typeof vi.fn>;
const clearCartMock = clearCart as unknown as ReturnType<typeof vi.fn>;
const decreaseCartItemMock = decreaseCartItem as unknown as ReturnType<
  typeof vi.fn
>;
const deleteCartItemMock = deleteCartItem as unknown as ReturnType<
  typeof vi.fn
>;

describe("cartStore", () => {
  beforeEach(() => {
    fetchCartMock.mockReset();
    addCartItemMock.mockReset();
    clearCartMock.mockReset();
    decreaseCartItemMock.mockReset();
    deleteCartItemMock.mockReset();

    const state = useCartStore.getState();
    useCartStore.setState({
      items: [],
      loading: false,
      error: null,
      initialized: false,
      initCart: state.initCart,
      addDish: state.addDish,
      decreaseItem: state.decreaseItem,
      removeItem: state.removeItem,
      clearAll: state.clearAll
    });
  });

  it("initCart 应该加载购物车并标记为 initialized", async () => {
    const serverItems: CartItem[] = [
      {
        id: 1,
        dishId: 42,
        setmealId: null,
        name: "Test Dish",
        image: "",
        number: 2,
        amount: 19.98
      }
    ];
    fetchCartMock.mockResolvedValue(serverItems);

    await useCartStore.getState().initCart();

    const state = useCartStore.getState();
    expect(fetchCartMock).toHaveBeenCalledTimes(1);
    expect(state.initialized).toBe(true);
    expect(state.items).toEqual(serverItems);
  });

  it("initCart 第二次调用不应重复请求", async () => {
    fetchCartMock.mockResolvedValue([]);

    await useCartStore.getState().initCart();
    await useCartStore.getState().initCart();

    expect(fetchCartMock).toHaveBeenCalledTimes(1);
  });

  it("addDish 应该调用 addCartItem 并更新 items", async () => {
    const serverItem: CartItem = {
      id: 1,
      dishId: 42,
      setmealId: null,
      name: "Burger",
      image: "",
      number: 1,
      amount: 9.99
    };
    addCartItemMock.mockResolvedValue(serverItem);

    await useCartStore.getState().addDish(42);

    const state = useCartStore.getState();
    expect(addCartItemMock).toHaveBeenCalledWith({ dishId: 42 });
    expect(state.items).toContainEqual(serverItem);
  });

  it("clearAll 应该清空 items 并调用 clearCart", async () => {
    useCartStore.setState((prev) => ({
      ...prev,
      items: [
        {
          id: 1,
          dishId: 42,
          setmealId: null,
          name: "Burger",
          image: "",
          number: 1,
          amount: 9.99
        }
      ]
    }));
    clearCartMock.mockResolvedValue(undefined);

    await useCartStore.getState().clearAll();

    const state = useCartStore.getState();
    expect(clearCartMock).toHaveBeenCalledTimes(1);
    expect(state.items).toEqual([]);
  });
});

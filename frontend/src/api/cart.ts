import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type CartItem = {
  id: number;
  dishId: number | null;
  setmealId: number | null;
  name: string;
  image?: string;
  number: number;
  amount: number;
};

export type CartSummary = {
  totalCount: number;
  totalAmount: number;
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const { data } = await http.get<ApiResponse<CartItem[]>>("/cart");
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取购物车失败");
  }
  return data.data;
};

export const addCartItem = async (payload: {
  dishId?: number;
  setmealId?: number;
}): Promise<CartItem> => {
  const { data } = await http.post<ApiResponse<CartItem>>(
    "/cart/items",
    payload
  );
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "加入购物车失败");
  }
  return data.data;
};

export const decreaseCartItem = async (itemId: number): Promise<void> => {
  const { data } = await http.patch<ApiResponse<null>>(
    `/cart/items/${itemId}/decrease`
  );
  if (data.code !== 0) {
    throw new Error(data.msg || "更新购物车失败");
  }
};

export const deleteCartItem = async (itemId: number): Promise<void> => {
  const { data } = await http.delete<ApiResponse<null>>(
    `/cart/items/${itemId}`
  );
  if (data.code !== 0) {
    throw new Error(data.msg || "删除购物车条目失败");
  }
};

export const clearCart = async (): Promise<void> => {
  const { data } = await http.delete<ApiResponse<null>>("/cart");
  if (data.code !== 0) {
    throw new Error(data.msg || "清空购物车失败");
  }
};


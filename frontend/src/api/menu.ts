import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type Category = {
  id: number;
  name: string;
  type: number; // 1: dish, 2: setmeal
  sort?: number;
};

export type Dish = {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  status?: number;
};

export type Setmeal = {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  status?: number;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await http.get<ApiResponse<Category[]>>("/category/list");
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取分类失败");
  }
  return data.data;
};

export const fetchDishesByCategory = async (
  categoryId: number
): Promise<Dish[]> => {
  const { data } = await http.get<ApiResponse<Dish[]>>("/dish/list", {
    params: { categoryId }
  });
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取菜品失败");
  }
  return data.data;
};

export const fetchSetmealsByCategory = async (
  categoryId: number
): Promise<Setmeal[]> => {
  const { data } = await http.get<ApiResponse<Setmeal[]>>("/setmeal/list", {
    params: { categoryId }
  });
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取套餐失败");
  }
  return data.data;
};

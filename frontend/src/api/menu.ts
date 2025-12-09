import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type Category = {
  id: string;
  name: string;
  type: "dish" | "setmeal" | string;
  sort?: number;
};

export type Dish = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
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


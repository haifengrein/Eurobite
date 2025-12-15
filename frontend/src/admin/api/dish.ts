import { http } from "@/lib/http";
import type { ApiResponse, PageResult } from "@/types/api";

export interface DishFlavor {
  name: string;
  value: string; // JSON array string e.g. "[\"Spicy\", \"Mild\"]" or just string? Let's check DTO
}

export interface Dish {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  code: string;
  image: string;
  description: string;
  status: number;
  sort: number;
  flavors: DishFlavor[];
  categoryName?: string; // Often populated by backend or frontend join
  updateTime?: string;
}

export type DishQuery = {
  page: number;
  pageSize: number;
  name?: string;
};

export const getDishPage = async (params: DishQuery) => {
  const { data } = await http.get<ApiResponse<PageResult<Dish>>>("/dish/page", {
    params,
  });
  return data;
};

export const addDish = async (dish: Partial<Dish>) => {
  const { data } = await http.post<ApiResponse<string>>("/dish", dish);
  return data;
};

export const updateDish = async (dish: Partial<Dish>) => {
  const { data } = await http.put<ApiResponse<string>>("/dish", dish);
  return data;
};

export const getDishById = async (id: string) => {
  const { data } = await http.get<ApiResponse<Dish>>(`/dish/${id}`);
  return data;
};

export const deleteDish = async (ids: string[]) => {
  const { data } = await http.delete<ApiResponse<string>>("/dish", {
    params: { ids: ids.join(",") },
  });
  return data;
};

export const updateDishStatus = async (status: number, ids: string[]) => {
  const { data } = await http.post<ApiResponse<string>>(`/dish/status/${status}`, null, {
    params: { ids: ids.join(",") },
  });
  return data;
};

export const getDishList = async (categoryId?: string) => {
  const { data } = await http.get<ApiResponse<Dish[]>>("/dish/list", {
    params: { categoryId },
  });
  return data;
};

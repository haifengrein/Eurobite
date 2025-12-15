import { http } from "@/lib/http";
import type { ApiResponse, PageResult } from "@/types/api";

export interface SetmealDish {
  dishId: string;
  name: string;
  price: number;
  copies: number;
}

export interface Setmeal {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  status: number;
  code: string;
  description: string;
  image: string;
  setmealDishes: SetmealDish[];
  categoryName?: string;
  updateTime?: string;
}

export type SetmealQuery = {
  page: number;
  pageSize: number;
  name?: string;
};

export const getSetmealPage = async (params: SetmealQuery) => {
  const { data } = await http.get<ApiResponse<PageResult<Setmeal>>>("/setmeal/page", {
    params,
  });
  return data;
};

export const addSetmeal = async (setmeal: Partial<Setmeal>) => {
  const { data } = await http.post<ApiResponse<string>>("/setmeal", setmeal);
  return data;
};

export const updateSetmeal = async (setmeal: Partial<Setmeal>) => {
  const { data } = await http.put<ApiResponse<string>>("/setmeal", setmeal);
  return data;
};

export const getSetmealById = async (id: string) => {
  const { data } = await http.get<ApiResponse<Setmeal>>(`/setmeal/${id}`);
  return data;
};

export const deleteSetmeal = async (ids: string[]) => {
  const { data } = await http.delete<ApiResponse<string>>("/setmeal", {
    params: { ids: ids.join(",") },
  });
  return data;
};

export const updateSetmealStatus = async (status: number, ids: string[]) => {
  const { data } = await http.post<ApiResponse<string>>(`/setmeal/status/${status}`, null, {
    params: { ids: ids.join(",") },
  });
  return data;
};

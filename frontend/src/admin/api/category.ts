import { http } from "@/lib/http";
import type { ApiResponse, PageResult } from "@/types/api";

export interface Category {
  id: string;
  type: number; // 1: Dish Category, 2: Setmeal Category
  name: string;
  sort: number;
  createTime?: string;
  updateTime?: string;
}

export type CategoryQuery = {
  page: number;
  pageSize: number;
};

export const getCategoryPage = async (params: CategoryQuery) => {
  const { data } = await http.get<ApiResponse<PageResult<Category>>>("/category/page", {
    params,
  });
  return data;
};

export const addCategory = async (category: Partial<Category>) => {
  const { data } = await http.post<ApiResponse<string>>("/category", category);
  return data;
};

export const updateCategory = async (category: Partial<Category>) => {
  const { data } = await http.put<ApiResponse<string>>("/category", category);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await http.delete<ApiResponse<string>>(`/category`, { params: { id } });
  return data;
};

export const getCategoryList = async (type?: number) => {
  const { data } = await http.get<ApiResponse<Category[]>>("/category/list", {
    params: { type },
  });
  return data;
};

import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type Address = {
  id: number;
  consignee: string;
  phone: string;
  detail: string;
  label?: string;
  isDefault?: boolean;
};

export const fetchAddresses = async (): Promise<Address[]> => {
  const { data } = await http.get<ApiResponse<Address[]>>("/address-book");
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取地址失败");
  }
  return data.data;
};

export const createAddress = async (
  payload: Omit<Address, "id">
): Promise<Address> => {
  const { data } = await http.post<ApiResponse<Address>>(
    "/address-book",
    payload
  );
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "创建地址失败");
  }
  return data.data;
};

export const updateAddress = async (
  id: number,
  payload: Omit<Address, "id">
): Promise<Address> => {
  const { data } = await http.put<ApiResponse<Address>>(
    `/address-book/${id}`,
    payload
  );
  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "更新地址失败");
  }
  return data.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  const { data } = await http.delete<ApiResponse<null>>(
    `/address-book/${id}`
  );
  if (data.code !== 0) {
    throw new Error(data.msg || "删除地址失败");
  }
};


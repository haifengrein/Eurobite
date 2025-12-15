import { http } from "@/lib/http";
import type { ApiResponse, PageResult } from "@/types/api";

export interface OrderDetail {
  id: string;
  name: string;
  image: string;
  orderId: string;
  dishId?: string;
  setmealId?: string;
  dishFlavor?: string;
  number: number;
  amount: number;
}

export interface Order {
  id: string;
  number: string;
  status: number;
  userId: string;
  addressBookId: string;
  orderTime: string;
  checkoutTime: string;
  payMethod: number;
  amount: number;
  remark?: string;
  userName?: string;
  phone?: string;
  address?: string;
  consignee?: string;
  orderDetails?: OrderDetail[]; // Sometimes fetched together
}

export type OrderQuery = {
  page: number;
  pageSize: number;
  number?: string;
  beginTime?: string;
  endTime?: string;
};

export const getOrderPage = async (params: OrderQuery) => {
  const { data } = await http.get<ApiResponse<PageResult<Order>>>("/orders/page", {
    params,
  });
  return data;
};

export const updateOrderStatus = async (order: { id: string; status: number }) => {
  const { data } = await http.put<ApiResponse<string>>("/orders", order);
  return data;
};

export const getOrderDetail = async (id: string) => {
  const { data } = await http.get<ApiResponse<{ order: Order; details: OrderDetail[] }>>(`/orders/${id}`);
  return data;
};

import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type SubmitOrderRequest = {
  addressId: number;
  remark?: string;
};

export type SubmitOrderResponse = {
  orderId: number;
  amount: number;
  status: string;
};

export type OrderStatus = "PENDING" | "DELIVERING" | "COMPLETED" | "CANCELLED";

export type OrderSummary = {
  id: string;
  number: string;
  status: number; // 后端返回数字，4=已完成
  amount: number;
  orderTime: string;
};

export type OrderDetailItem = {
  id: number;
  name: string;
  image?: string;
  number: number;
  amount: number;
};

export type OrderDetail = {
  id: number;
  number: string;
  status: OrderStatus;
  amount: number;
  orderTime: string;
  address: string;
  consignee: string;
  phone: string;
  items: OrderDetailItem[];
};

export const submitOrder = async (
  payload: SubmitOrderRequest
): Promise<SubmitOrderResponse> => {
  const { data } = await http.post<ApiResponse<SubmitOrderResponse>>(
    "/orders",
    payload
  );

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "下单失败");
  }

  return data.data;
};

export const fetchMyOrders = async (params?: {
  page?: number;
  size?: number;
  status?: OrderStatus | "ALL";
}): Promise<OrderSummary[]> => {
  const { page = 1, size = 10, status } = params ?? {};
  const { data } = await http.get<ApiResponse<{ content: OrderSummary[] }>>("/orders/me", {
    params: {
      page,
      size,
      status: status && status !== "ALL" ? status : undefined
    }
  });

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取订单列表失败");
  }

  return data.data.content;
};

export const fetchOrderDetail = async (
  orderId: number
): Promise<OrderDetail> => {
  const { data } = await http.get<ApiResponse<OrderDetail>>(
    `/orders/${orderId}`
  );

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取订单详情失败");
  }

  return data.data;
};


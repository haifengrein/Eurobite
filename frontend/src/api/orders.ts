import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type SubmitOrderRequest = {
  addressId: number;
  remark?: string;
};

export type SubmitOrderResponse = {
  orderId: number;
  amount: number;
  status: number;
};

export type OrderStatus = number; // 后端使用数字状态码

export type OrderSummary = {
  id: number;
  number: string;
  status: number; // 后端返回数字状态码（与 /admin 侧一致）
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
  status: number;
  amount: number;
  orderTime: string;
  address: string;
  consignee: string;
  phone: string;
  items: OrderDetailItem[];
};

type OrdersEntity = {
  id: number | string;
  number: string;
  status: number | string;
  amount: number | string;
  orderTime: string;
  address: string;
  consignee: string;
  phone: string;
};

type OrderDetailEntity = {
  id: number | string;
  name: string;
  image?: string | null;
  number: number | string;
  amount: number | string;
};

type OrderWithDetailDTO = {
  order: OrdersEntity;
  items: OrderDetailEntity[];
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return Number(value);
};

export const submitOrder = async (
  payload: SubmitOrderRequest
): Promise<SubmitOrderResponse> => {
  const { data } = await http.post<ApiResponse<any>>("/orders", payload);

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "下单失败");
  }

  const order = data.data as Partial<OrdersEntity>;
  return {
    orderId: toNumber(order.id),
    amount: toNumber(order.amount),
    status: toNumber(order.status)
  };
};

export const fetchMyOrders = async (params?: {
  page?: number;
  size?: number;
  status?: OrderStatus | "ALL";
}): Promise<OrderSummary[]> => {
  const { page = 1, size = 10, status } = params ?? {};
  const { data } = await http.get<ApiResponse<{ content: any[] }>>("/orders/me", {
    params: {
      page,
      size,
      status: status && status !== "ALL" ? status : undefined
    }
  });

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取订单列表失败");
  }

  return (data.data.content ?? []).map((o: any) => ({
    id: toNumber(o.id),
    number: String(o.number ?? ""),
    status: toNumber(o.status),
    amount: toNumber(o.amount),
    orderTime: String(o.orderTime ?? "")
  }));
};

export const fetchOrderDetail = async (
  orderId: number
): Promise<OrderDetail> => {
  const { data } = await http.get<ApiResponse<OrderWithDetailDTO>>(`/orders/${orderId}`);

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "获取订单详情失败");
  }

  const dto = data.data;
  const order = dto.order;
  return {
    id: toNumber(order.id),
    number: String(order.number ?? ""),
    status: toNumber(order.status),
    amount: toNumber(order.amount),
    orderTime: String(order.orderTime ?? ""),
    address: String(order.address ?? ""),
    consignee: String(order.consignee ?? ""),
    phone: String(order.phone ?? ""),
    items: (dto.items ?? []).map((i) => ({
      id: toNumber(i.id),
      name: String(i.name ?? ""),
      image: i.image ? String(i.image) : undefined,
      number: toNumber(i.number),
      amount: toNumber(i.amount)
    }))
  };
};

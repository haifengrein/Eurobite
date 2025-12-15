import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type RecentOrder = {
  id: string;
  orderNumber: string;
  userName: string;
  amount: number;
  orderTime: string;
  status: number;
};

export type DashboardData = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  recentOrders: RecentOrder[];
};

export const getDashboardData = async () => {
  const { data } = await http.get<ApiResponse<DashboardData>>("/report/dashboard");
  return data;
};

import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export type SystemConfigMap = Record<string, string>;

export const getSystemConfigs = async () => {
  const { data } = await http.get<ApiResponse<SystemConfigMap>>("/system/config");
  return data;
};

export const updateSystemConfigs = async (configs: SystemConfigMap) => {
  const { data } = await http.post<ApiResponse<string>>("/system/config", configs);
  return data;
};

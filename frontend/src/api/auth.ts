import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/store/userStore";

export type LoginRequest = {
  phone: string;
  code: string;
};

export type LoginResponseData = {
  token: string;
  user: User;
};

export const login = async (payload: LoginRequest) => {
  const { data } = await http.post<ApiResponse<LoginResponseData>>(
    "/auth/user/login",
    payload
  );

  if (data.code !== 0 || !data.data) {
    throw new Error(data.msg || "登录失败");
  }

  return data.data;
};

export const sendVerificationCode = async (phone: string) => {
  const { data } = await http.post<ApiResponse<string>>(
    "/auth/user/sendMsg",
    { phone }
  );

  if (data.code !== 0) {
    throw new Error(data.msg || "发送验证码失败");
  }

  return data.data;
};

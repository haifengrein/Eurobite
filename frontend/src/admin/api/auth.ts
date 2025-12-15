import { http } from "@/lib/http";

export const loginEmployee = (data: any) => {
  return http.post("/auth/employee/login", data);
};

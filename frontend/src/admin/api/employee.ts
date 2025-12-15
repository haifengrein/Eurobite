import { http } from "@/lib/http";
import type { ApiResponse, PageResult } from "@/types/api";

export interface Employee {
  id: string;
  username: string;
  name: string;
  phone: string;
  sex: string;
  status: number;
  role: 'ADMIN' | 'CHEF' | 'STAFF';
  createTime?: string;
  updateTime?: string;
}

export type EmployeeQuery = {
  page: number;
  pageSize: number;
  name?: string;
};

export const getEmployeePage = async (params: EmployeeQuery) => {
  const { data } = await http.get<ApiResponse<PageResult<Employee>>>("/employee/page", {
    params,
  });
  return data;
};

export const addEmployee = async (employee: Partial<Employee>) => {
  const { data } = await http.post<ApiResponse<string>>("/employee", employee);
  return data;
};

export const updateEmployee = async (employee: Partial<Employee>) => {
  const { data } = await http.put<ApiResponse<string>>("/employee", employee);
  return data;
};

export const getEmployeeById = async (id: string) => {
  const { data } = await http.get<ApiResponse<Employee>>(`/employee/${id}`);
  return data;
};

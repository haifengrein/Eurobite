import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const http = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 10000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("eurobite_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 这里不直接调用 toast，由上层捕获后决定是否展示
    return Promise.reject(error);
  }
);


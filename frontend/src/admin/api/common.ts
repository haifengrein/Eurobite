import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await http.post<ApiResponse<string>>("/common/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getImageUrl = (fileName: string) => {
  // Assuming the backend serves images directly or via a specific endpoint
  // In Reggie, it's often /common/download?name=...
  // Or if served statically via Nginx:
  return `/api/common/download?name=${fileName}`;
};

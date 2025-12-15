export type ApiResponse<T> = {
  code: number;
  msg: string;
  data: T;
  map: Record<string, any>;
};

export type PageResult<T> = {
  content: T[]; // Spring Data Page impl typically returns 'content'
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
};
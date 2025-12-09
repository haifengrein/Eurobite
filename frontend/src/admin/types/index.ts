// Base types
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
}

// Order types
export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    name: string;
    phone: string;
  };
  amount: number;
  status: OrderStatus;
  payMethod?: string;
  remark?: string;
  orderTime: string;
  checkoutTime?: string;
  address?: string;
  phone?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId?: string;
  setmealId?: string;
  name: string;
  image?: string;
  number: number;
  amount: number;
}

// Dish types
export type DishStatus = 0 | 1; // 0: off, 1: on

export interface Dish {
  id: string;
  name: string;
  categoryId: string;
  category?: {
    name: string;
  };
  price: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  status: DishStatus;
  flavors?: DishFlavor[];
  createTime: string;
  updateTime: string;
}

export interface DishFlavor {
  id: string;
  dishId: string;
  name: string;
  value: string;
  isRequired: boolean;
}

// Setmeal types
export type SetmealStatus = 0 | 1;

export interface Setmeal {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image?: string;
  description?: string;
  status: SetmealStatus;
  dishes?: SetmealDish[];
  createTime: string;
  updateTime: string;
}

export interface SetmealDish {
  id: string;
  setmealId: string;
  dishId: string;
  name: string;
  price: number;
  number: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  sort?: number;
  type?: number;
  status?: number;
  createTime: string;
  updateTime: string;
  children?: Category[];
}

// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  registerTime: string;
  lastLoginTime?: string;
  orderCount: number;
  totalAmount: number;
}

// Employee types
export interface Employee {
  id: string;
  name: string;
  username: string;
  phone: string;
  department: string;
  position: string;
  status: number;
  createTime: string;
  lastLoginTime?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResult<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// Form types
export interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

export interface DishFormData {
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  status: DishStatus;
  flavors: DishFlavorFormData[];
}

export interface DishFlavorFormData {
  name: string;
  isRequired: boolean;
  values: string[];
}

// Mock data for testing
export const mockOrder = (): Order => ({
  id: '1',
  orderNumber: '123456789',
  userId: '1',
  user: {
    name: ' 	',
    phone: '13800138000'
  },
  amount: 100,
  status: 'pending',
  orderTime: '2025-12-09 12:00:00',
  remark: 'Å£',
  items: []
});

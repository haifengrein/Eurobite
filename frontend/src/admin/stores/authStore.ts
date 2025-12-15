import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'CHEF' | 'STAFF';

interface Employee {
  id: number;
  username: string;
  name: string;
  phone: string;
  sex: string;
  status: number;
  role: UserRole;
  createTime: string;
  updateTime: string;
}

interface AuthState {
  token: string | null;
  employee: Employee | null;
  permissions: string[]; // Array of permission strings
  setAuth: (token: string, employee: Employee) => void;
  clearAuth: () => void;
  hasPermission: (permission: string) => boolean; // Check if user has specific permission
}

const STORAGE_KEY = 'eurobite_admin_token';

// Initialize from localStorage
const initializeAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, employee: null, permissions: [] };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const { token, employee } = JSON.parse(stored);
      const permissions = generatePermissions(employee?.role);
      return { token, employee, permissions };
    } catch (e) {
      console.error('Failed to parse auth data from localStorage', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return { token: null, employee: null, permissions: [] };
};

// Generate permissions based on role
const generatePermissions = (role?: UserRole): string[] => {
  const basePermissions = ['dashboard:read'];

  switch (role) {
    case 'ADMIN':
      return [
        ...basePermissions,
        'orders:read', 'orders:write',
        'dishes:read', 'dishes:write',
        'setmeals:read', 'setmeals:write',
        'categories:read', 'categories:write',
        'employees:read', 'employees:write',
        'settings:read', 'settings:write',
        'users:read', 'users:write',
      ];
    case 'CHEF':
      return [
        ...basePermissions,
        'orders:read', 'orders:write',
        'dishes:read', 'dishes:write',
        'setmeals:read', 'setmeals:write',
        'categories:read', 'categories:write',
      ];
    case 'STAFF':
      return [
        ...basePermissions,
        'orders:read', 'orders:write',
      ];
    default:
      return basePermissions;
  }
};

const initialState = initializeAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,
  setAuth: (token: string, employee: Employee) => {
    const permissions = generatePermissions(employee?.role);
    const authData = { token, employee };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    set({ token, employee, permissions });
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, employee: null, permissions: [] });
  },
  hasPermission: (permission: string) => {
    const { permissions } = get();
    // Safe check with fallback
    return Array.isArray(permissions) && permissions.includes(permission);
  },
}));

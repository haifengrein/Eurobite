import { create } from "zustand";

export type User = {
  id: string;
  name?: string | null;
  phone: string;
  status?: number;
};

type UserState = {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
};

const getInitialToken = (): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("eurobite_token");
    }
  } catch {
    // ignore
  }
  return null;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: getInitialToken(),
  setSession: (user, token) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("eurobite_token", token);
      }
    } catch {
      // ignore
    }
    set({ user, token });
  },
  clearSession: () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("eurobite_token");
      }
    } catch {
      // ignore
    }
    set({ user: null, token: null });
  }
}));

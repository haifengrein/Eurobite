import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore, type User } from "./userStore";

describe("userStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.setState({
      user: null,
      token: null,
      setSession: useUserStore.getState().setSession,
      clearSession: useUserStore.getState().clearSession
    });
  });

  it("setSession 应该写入 user 与 token 并持久化 token", () => {
    const user: User = { id: 1, name: "Alice", phone: "+49123456789" };
    const token = "dummy-token";

    useUserStore.getState().setSession(user, token);

    const state = useUserStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(localStorage.getItem("eurobite_token")).toBe(token);
  });

  it("clearSession 应该清空状态并移除本地 token", () => {
    const user: User = { id: 1, name: "Alice", phone: "+49123456789" };
    const token = "dummy-token";
    useUserStore.getState().setSession(user, token);

    useUserStore.getState().clearSession();

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem("eurobite_token")).toBeNull();
  });
});

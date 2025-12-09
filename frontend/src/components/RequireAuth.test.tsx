import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { RequireAuth } from "./RequireAuth";
import { useUserStore, type User } from "@/store/userStore";

describe("RequireAuth", () => {
  beforeEach(() => {
    // 清理用户状态；localStorage 在 setupTests 中已提供内存实现
    localStorage.clear();
    useUserStore.setState({
      user: null,
      token: null,
      setSession: useUserStore.getState().setSession,
      clearSession: useUserStore.getState().clearSession
    });
  });

  it("未登录时应重定向到 /login", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>登录页</div>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div>受保护内容</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("登录页")).toBeInTheDocument();
  });

  it("已登录时应展示受保护内容", () => {
    const user: User = { id: 1, name: "Alice", phone: "+49123456789" };
    useUserStore.getState().setSession(user, "dummy-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>登录页</div>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div>受保护内容</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("受保护内容")).toBeInTheDocument();
  });
});

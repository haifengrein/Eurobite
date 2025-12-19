import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";

vi.mock("@/api/menu", () => ({
  fetchCategories: vi.fn(),
  fetchDishesByCategory: vi.fn(),
  fetchSetmealsByCategory: vi.fn()
}));

vi.mock("@/store/cartStore", () => {
  const useCartStore = (selector: any) =>
    selector({
      initCart: vi.fn(),
      addDish: vi.fn(),
      addSetmeal: vi.fn(),
      decreaseDish: vi.fn(),
      decreaseSetmeal: vi.fn(),
      items: []
    });
  const useCartSummary = () => ({ totalCount: 0, totalAmount: 0 });
  return {
    useCartStore,
    useCartSummary
  };
});

vi.mock("@/components/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

import { fetchCategories, fetchDishesByCategory } from "@/api/menu";

describe("HomePage", () => {
  beforeEach(() => {
    (fetchCategories as any).mockReset?.();
    (fetchDishesByCategory as any).mockReset?.();
  });

  it("应展示分类和菜品列表", async () => {
    (fetchCategories as any).mockResolvedValue([
      { id: 1, name: "Burgers", type: 1 }
    ]);
    (fetchDishesByCategory as any).mockResolvedValue([
      { id: 101, name: "Cheeseburger", price: 9.99 }
    ]);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    // 等待分类和菜品加载完成
    await screen.findByText("Burgers");
    await screen.findByText("Cheeseburger");

    // 断言菜品名称和价格渲染
    await waitFor(() => {
      expect(screen.getByText("Cheeseburger")).toBeInTheDocument();
      expect(screen.getByText(/9\.99/)).toBeInTheDocument();
    });
  });
});

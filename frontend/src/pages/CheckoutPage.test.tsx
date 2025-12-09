import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutPage from "./CheckoutPage";

vi.mock("@/api/addressBook", () => ({
  fetchAddresses: vi.fn()
}));

vi.mock("@/api/orders", () => ({
  submitOrder: vi.fn()
}));

vi.mock("@/store/cartStore", () => {
  const useCartStore = (selector: any) =>
    selector({
      items: [
        {
          id: 1,
          dishId: 101,
          setmealId: null,
          name: "Cheeseburger",
          image: "",
          number: 2,
          amount: 19.98
        }
      ],
      clearAll: vi.fn()
    });
  const useCartSummary = () => ({ totalCount: 2, totalAmount: 19.98 });
  return {
    useCartStore,
    useCartSummary
  };
});

vi.mock("@/components/ToastProvider", () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

import { fetchAddresses } from "@/api/addressBook";
import { submitOrder } from "@/api/orders";

describe("CheckoutPage", () => {
  beforeEach(() => {
    (fetchAddresses as any).mockReset?.();
    (submitOrder as any).mockReset?.();
  });

  it("在提交订单时应调用 submitOrder 与 clearAll，并跳转到订单列表", async () => {
    (fetchAddresses as any).mockResolvedValue([
      {
        id: 10,
        consignee: "Alice",
        phone: "+49123456789",
        detail: "Street 1, Berlin",
        label: "Home",
        isDefault: true
      }
    ]);
    (submitOrder as any).mockResolvedValue({
      orderId: 5001,
      amount: 19.98,
      status: "PENDING"
    });

    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<div>订单列表</div>} />
        </Routes>
      </MemoryRouter>
    );

    // 等待地址加载完成
    await screen.findByText("Alice");

    const submitButton = screen.getByRole("button", { name: "提交订单" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitOrder as any).toHaveBeenCalledWith({
        addressId: 10,
        remark: undefined
      });
      expect(screen.getByText("订单列表")).toBeInTheDocument();
    });
  });
});

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchMyOrders,
  type OrderSummary
} from "@/api/orders";
import { useToast } from "@/components/ToastProvider";
import { Skeleton } from "@/components/Skeleton";
import { clsx } from "clsx";
import { Clock, CheckCircle2, XCircle, ShoppingBag, ChefHat, Truck } from "lucide-react";
import { motion } from "framer-motion";

type FilterStatus = "ALL" | number;

const STATUS_CONFIG: Record<number, { label: string; color: string; icon: any }> = {
  1: { label: "Pending", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock }, // 待付款
  2: { label: "Paid", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 }, // 已付款
  3: { label: "Cooking", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: ChefHat }, // 制作中
  4: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 }, // 已完成
  5: { label: "Cancelled", color: "bg-zinc-100 text-zinc-500 border-zinc-200", icon: XCircle } // 已取消
};

const FilterStatusOptions: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: 1, label: "Pending" },
  { value: 3, label: "Cooking" },
  { value: 4, label: "Done" },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [status, setStatus] = useState<FilterStatus>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation() as { state?: { orderId?: number } };
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchMyOrders({ status, page: 1, size: 20 });
        setOrders(list);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Network error";
        setError(message);
        showToast(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [status]);

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 px-5 pt-12 pb-4 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tight">Your Orders</h1>
        
        {/* Filters */}
        <div className="scrollbar-hide -mx-5 mt-4 flex overflow-x-auto px-5">
          <div className="flex gap-2 pb-2">
            {FilterStatusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  status === opt.value
                    ? "bg-foreground text-background"
                    : "bg-white text-muted-foreground border border-zinc-100 hover:bg-zinc-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-white p-6 shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
              <ShoppingBag className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="mt-4 font-semibold">No orders yet</h3>
            <p className="text-sm text-muted-foreground">Start exploring our menu!</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, idx) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG[5];
            const StatusIcon = statusConfig.icon;

            return (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="group w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50">
                      <ShoppingBag className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Order #{order.number}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.orderTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={clsx(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border",
                    statusConfig.color
                  )}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-50 pt-4">
                   <span className="text-xs font-medium text-zinc-500">
                     {/* Could show item count here if available in summary */}
                     Tap to view details
                   </span>
                   <span className="text-lg font-bold text-foreground">
                     €{order.amount.toFixed(2)}
                   </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
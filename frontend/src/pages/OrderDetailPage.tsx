import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderDetail, type OrderDetail } from "@/api/orders";
import { ArrowLeft, MapPin, Receipt, Phone, Clock, ShoppingBag, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const STATUS_MAP: Record<number, { label: string; bg: string; text: string; icon: any }> = {
  1: { label: "Pending Payment", bg: "bg-orange-500", text: "text-white", icon: Clock },
  2: { label: "Preparing", bg: "bg-blue-500", text: "text-white", icon: ShoppingBag },
  3: { label: "Delivering", bg: "bg-yellow-500", text: "text-white", icon: Phone },
  4: { label: "Completed", bg: "bg-green-500", text: "text-white", icon: CheckCircle2 },
  5: { label: "Cancelled", bg: "bg-zinc-500", text: "text-white", icon: Receipt },
};

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const id = Number(orderId);
    if (Number.isNaN(id)) return;
    
    const load = async () => {
      setLoading(true);
      try {
        const detail = await fetchOrderDetail(id);
        setOrder(detail);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [orderId]);

  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading details...</div>;
  if (!order) return null;

  const statusConfig = STATUS_MAP[order.status] || STATUS_MAP[1];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen w-full bg-zinc-50 pb-10">
      {/* 1. Status Header (Full Bleed) */}
      <div className={clsx("relative w-full pb-10 pt-6 transition-colors", statusConfig.bg)}>
        <header className="mb-6 flex items-center px-4">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-lg font-bold text-white">Order Details</h1>
        </header>

        <div className="flex flex-col items-center justify-center text-white">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <StatusIcon className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">{statusConfig.label}</h2>
          <p className="opacity-90">Order #{order.number}</p>
        </div>
      </div>

      <div className="-mt-6 px-4">
        {/* 2. Delivery Info Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 rounded-3xl bg-white p-5 shadow-sm"
        >
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery To</h3>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-50 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">{order.consignee}</p>
              <p className="text-sm text-muted-foreground">{order.phone}</p>
              <p className="mt-1 text-sm text-zinc-700">{order.address}</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Order Items */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white p-5 shadow-sm"
        >
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Receipt</h3>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-xs font-bold text-zinc-500">
                    x{item.number}
                  </div>
                  {item.image && <img src={item.image} className="h-10 w-10 rounded-lg object-cover" />}
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="font-bold text-zinc-900">€{(item.amount * item.number).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          
          <div className="my-4 h-px w-full bg-zinc-100" />
          
          <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Order Time</span>
             <span className="font-medium text-zinc-700">{new Date(order.orderTime).toLocaleString()}</span>
          </div>
          
          <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 p-4">
             <span className="font-bold text-zinc-900">Total Paid</span>
             <span className="text-xl font-bold text-primary">€{order.amount.toFixed(2)}</span>
          </div>
        </motion.div>
        
        {/* Support Action */}
        <div className="mt-6 flex justify-center">
           <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
             <Phone className="h-4 w-4" />
             Contact Support
           </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
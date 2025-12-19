import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore, useCartSummary } from "@/store/cartStore";
import { fetchAddresses, type Address } from "@/api/addressBook";
import { submitOrder } from "@/api/orders";
import { useToast } from "@/components/ToastProvider";
import { ChevronRight, MapPin, Receipt, CreditCard, Wallet, NotebookPen, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearAll = useCartStore((state) => state.clearAll);
  const { totalAmount } = useCartSummary();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"apple" | "card">("apple");

  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchAddresses();
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault);
          setSelectedAddressId((defaultAddr ?? list[0]).id);
        }
      } catch (err) {
        showToast("Failed to load addresses");
      }
    };
    void load();
  }, []);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      showToast("Please select an address");
      return;
    }
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      const order = await submitOrder({
        addressId: selectedAddressId,
        remark: remark.trim() || undefined
      });
      await clearAll();
      navigate("/orders", {
        replace: true,
        state: { orderId: order.orderId }
      });
      showToast("Order placed successfully!");
    } catch (err) {
      showToast("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 pb-32 pt-6">
      <header className="mb-6 flex items-center px-4">
        <button onClick={() => navigate(-1)} className="mr-4 rounded-full bg-white p-2 shadow-sm">
          <ArrowLeft className="h-5 w-5 text-zinc-700" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Checkout</h1>
      </header>

      <div className="px-4 space-y-6">
        {/* Address Section */}
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Address</h2>
            <button 
               onClick={() => navigate("/addresses")}
               className="text-xs font-medium text-primary hover:underline"
            >
              Change
            </button>
          </div>
          
          <button 
            onClick={() => navigate("/addresses")}
            className="w-full text-left"
          >
            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all active:scale-[0.98]">
              {selectedAddress ? (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-50">
                    <MapPin className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{selectedAddress.label || "Home"}</h3>
                    <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{selectedAddress.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                       {selectedAddress.consignee} • {selectedAddress.phone}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300" />
                </div>
              ) : (
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span>Select an address...</span>
                </div>
              )}
            </div>
          </button>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Summary</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
            <ul className="divide-y divide-zinc-50">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-xs font-bold text-zinc-500">
                      x{item.number}
                    </div>
                    {item.image && <img src={item.image} className="h-8 w-8 rounded-md object-cover" />}
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-zinc-900">€{(item.amount * item.number).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-zinc-50 bg-zinc-50/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">€{totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                 <span className="text-muted-foreground">Delivery Fee</span>
                 <span className="font-medium text-primary">Free</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3">
                 <span className="text-base font-bold text-foreground">Total</span>
                 <span className="text-xl font-bold text-foreground">€{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method (Mock) */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method</h2>
          <div className="flex gap-3">
             <button
               onClick={() => setPaymentMethod("apple")}
               className={clsx(
                 "flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 transition-all",
                 paymentMethod === "apple"
                   ? "border-black bg-black text-white shadow-lg"
                   : "border-zinc-200 bg-white text-zinc-600"
               )}
             >
               <Wallet className="h-5 w-5" />
               <span className="font-medium">Apple Pay</span>
             </button>
             <button
               onClick={() => setPaymentMethod("card")}
               className={clsx(
                 "flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 transition-all",
                 paymentMethod === "card"
                   ? "border-black bg-black text-white shadow-lg"
                   : "border-zinc-200 bg-white text-zinc-600"
               )}
             >
               <CreditCard className="h-5 w-5" />
               <span className="font-medium">Card</span>
             </button>
          </div>
        </section>
        
        {/* Remark */}
        <section>
          <div className="relative rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
            <NotebookPen className="absolute left-4 top-4 h-5 w-5 text-zinc-400" />
             <textarea
              className="w-full resize-none rounded-xl bg-transparent p-3 pl-10 text-sm outline-none placeholder:text-zinc-400"
              rows={2}
              placeholder="Add a note for the kitchen (e.g. no onions)..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-[430px] border-t border-zinc-100 bg-white/80 p-4 pb-8 backdrop-blur-xl">
          <div className="mx-auto max-w-md">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group flex w-full items-center justify-between rounded-2xl bg-primary p-1 pl-6 pr-2 text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-medium opacity-80">Total to pay</span>
                <span className="text-lg font-bold">€{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex h-12 items-center gap-2 rounded-xl bg-white/20 px-6 font-bold backdrop-blur-sm transition-colors group-hover:bg-white/30">
                {loading ? "Processing..." : "Pay Now"}
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

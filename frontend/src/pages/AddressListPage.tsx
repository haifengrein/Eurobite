import { useEffect, useState, FormEvent } from "react";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  type Address
} from "@/api/addressBook";
import { useToast } from "@/components/ToastProvider";
import { MapPin, Plus, Trash2, Edit2, Home, Briefcase, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const AddressListPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  
  // Form State
  const [consignee, setConsignee] = useState("");
  const [phone, setPhone] = useState("");
  const [detail, setDetail] = useState("");
  const [label, setLabel] = useState("Home"); // Default label

  const { showToast } = useToast();

  const resetForm = () => {
    setEditing(null);
    setConsignee("");
    setPhone("");
    setDetail("");
    setLabel("Home");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await fetchAddresses();
        setAddresses(list);
      } catch (err) {
        showToast("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const openForm = (address?: Address) => {
    if (address) {
      setEditing(address);
      setConsignee(address.consignee);
      setPhone(address.phone);
      setDetail(address.detail);
      setLabel(address.label ?? "Home");
    } else {
      resetForm();
    }
    setFormVisible(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consignee.trim() || !phone.trim() || !detail.trim()) {
      showToast("Please fill in all fields");
      return;
    }
    
    try {
      if (editing) {
        const updated = await createAddress({
          consignee,
          phone,
          detail,
          label,
          isDefault: editing.isDefault
        });
        setAddresses((prev) =>
          prev.map((a) => (a.id === editing.id ? updated : a))
        );
      } else {
        const created = await createAddress({
          consignee,
          phone,
          detail,
          label,
          isDefault: false
        });
        setAddresses((prev) => [...prev, created]);
      }
      setFormVisible(false);
      resetForm();
      showToast("Address saved");
    } catch (err) {
      showToast("Failed to save address");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;
    
    const prev = addresses;
    setAddresses(prev.filter((a) => a.id !== id));
    try {
      await deleteAddress(id);
      showToast("Address deleted");
    } catch (err) {
      setAddresses(prev);
      showToast("Failed to delete");
    }
  };

  const getLabelIcon = (l: string) => {
    if (l.toLowerCase() === "work") return <Briefcase className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen w-full bg-background pb-28 pt-8">
      <div className="flex items-center justify-between px-6 mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
        <button
          onClick={() => openForm()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 space-y-4">
        {loading && <div className="text-center text-sm text-muted-foreground">Loading...</div>}
        
        {!loading && addresses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-sm text-muted-foreground">No addresses yet.</p>
          </div>
        )}

        <AnimatePresence>
          {addresses.map((addr) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={addr.id}
              className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-500">
                    {getLabelIcon(addr.label || "Home")}
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                       <h3 className="font-bold text-foreground">{addr.label || "Home"}</h3>
                       {addr.isDefault && (
                         <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Default</span>
                       )}
                     </div>
                     <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{addr.detail}</p>
                     <p className="mt-1 text-xs text-muted-foreground">
                       {addr.consignee} • {addr.phone}
                     </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 border-t border-zinc-50 pt-3">
                <button 
                  onClick={() => openForm(addr)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Drawer Form */}
      <AnimatePresence>
	        {formVisible && (
	          <>
	            <motion.div
	              initial={{ opacity: 0 }}
	              animate={{ opacity: 1 }}
	              exit={{ opacity: 0 }}
	              onClick={() => setFormVisible(false)}
	              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
	            />
	            <motion.div
	              initial={{ y: "100%" }}
	              animate={{ y: 0 }}
	              exit={{ y: "100%" }}
	              transition={{ type: "spring", damping: 25, stiffness: 300 }}
	              className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
	            >
	              <div className="w-full max-w-[430px] rounded-t-[32px] bg-white p-6 pb-10 shadow-2xl">
	                <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-zinc-200" />
	              
	              <div className="mb-6 flex items-center justify-between">
	                <h2 className="text-xl font-bold text-foreground">
	                  {editing ? "Edit Address" : "New Address"}
	                </h2>
                <button onClick={() => setFormVisible(false)} className="rounded-full bg-zinc-100 p-2">
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>

	              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Contact</label>
                    <input
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white"
                      value={consignee}
                      onChange={(e) => setConsignee(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Phone</label>
                    <input
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Address Detail</label>
                  <textarea
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white"
                    value={detail}
                    rows={3}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Street, number, apartment..."
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <div className="flex gap-3">
                    {["Home", "Work", "Other"].map(l => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLabel(l)}
                        className={clsx(
                          "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                          label === l 
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 active:scale-95"
                  >
                    Save Address
                  </button>
                </div>
	              </form>
	              </div>
	            </motion.div>
	          </>
	        )}
	      </AnimatePresence>
    </div>
  );
};

export default AddressListPage;

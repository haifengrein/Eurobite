import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchDishesByCategory,
  fetchSetmealsByCategory,
  type Category,
  type Dish,
  type Setmeal
} from "@/api/menu";
import { useCartStore, useCartSummary } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ToastProvider";
import { Skeleton } from "@/components/Skeleton";
import { Plus, Minus, ShoppingBag, Search } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [setmeals, setSetmeals] = useState<Setmeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());

  const initCart = useCartStore((state) => state.initCart);
  const addDish = useCartStore((state) => state.addDish);
  const addSetmeal = useCartStore((state) => state.addSetmeal);
  const decreaseDish = useCartStore((state) => state.decreaseDish);
  const decreaseSetmeal = useCartStore((state) => state.decreaseSetmeal);
  const cartItems = useCartStore((state) => state.items);
  
  const { totalAmount, totalCount } = useCartSummary();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const loadInitial = async () => {
      try {
        await initCart();
        const list = await fetchCategories();
        setCategories(list);
        if (list.length > 0) {
          setSelectedCategoryId(list[0].id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Network error";
        showToast(message);
      }
    };
    loadInitial();
  }, [initCart]);

  useEffect(() => {
    if (selectedCategoryId == null) return;
    const loadDishes = async () => {
      setLoading(true);
      setError(null);
      try {
        const category = categories.find((c) => c.id === selectedCategoryId);
        if (!category) {
          setDishes([]);
          setSetmeals([]);
          return;
        }

        if (category.type === 2) {
          const list = await fetchSetmealsByCategory(selectedCategoryId);
          setSetmeals(list);
          setDishes([]);
          return;
        }

        const list = await fetchDishesByCategory(selectedCategoryId);
        setDishes(list);
        setSetmeals([]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dishes";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void loadDishes();
  }, [selectedCategoryId, categories]);

  const handleAddDish = async (dishId: number) => {
    try {
      setAnimatingIds((prev) => new Set(prev).add(dishId));
      await addDish(dishId);
      setTimeout(() => {
        setAnimatingIds((prev) => {
          const next = new Set(prev);
          next.delete(dishId);
          return next;
        });
      }, 300);
    } catch (err) {
       showToast("Failed to add");
    }
  };

  const handleDecreaseDish = async (dishId: number) => {
    try {
      await decreaseDish(dishId);
    } catch (err) {
      showToast("Failed to update");
    }
  };

  const handleAddSetmeal = async (setmealId: number) => {
    try {
      setAnimatingIds((prev) => new Set(prev).add(setmealId));
      await addSetmeal(setmealId);
      setTimeout(() => {
        setAnimatingIds((prev) => {
          const next = new Set(prev);
          next.delete(setmealId);
          return next;
        });
      }, 300);
    } catch (err) {
      showToast("Failed to add");
    }
  };

  const handleDecreaseSetmeal = async (setmealId: number) => {
    try {
      await decreaseSetmeal(setmealId);
    } catch (err) {
      showToast("Failed to update");
    }
  };

  // Helper to find quantity in cart
  const getQuantity = (dishId: number) => {
    const item = cartItems.find(i => i.dishId === dishId);
    return item ? item.number : 0;
  };

  const getSetmealQuantity = (setmealId: number) => {
    const item = cartItems.find(i => i.setmealId === setmealId);
    return item ? item.number : 0;
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 px-5 pt-12 pb-2">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Euro<span className="text-primary">Bite</span>
              </h1>
              <p className="text-sm font-medium text-zinc-500">Deliciousness awaits</p>
            </div>
            <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100 transition-all hover:shadow-md">
              <Search className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-primary" />
            </button>
          </div>

          <div className="scrollbar-hide -mx-5 mt-6 flex overflow-x-auto px-5 pb-4">
            <div className="flex gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={clsx(
                    "relative flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95",
                    selectedCategoryId === c.id
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                      : "bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-100 hover:bg-zinc-50"
                  )}
                >
                  {c.name}
                  {selectedCategoryId === c.id && (
                    <motion.div
                      layoutId="cat-indicator"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Dish List */}
      <section className="flex-1 px-4 pt-0">
        {loading && (
           <div className="mt-2 grid gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex h-28 gap-4 rounded-[2rem] bg-white p-4 shadow-sm opacity-60">
                 <Skeleton className="aspect-square h-full rounded-2xl" />
                 <div className="flex-1 space-y-3 py-2">
                   <Skeleton className="h-4 w-2/3" />
                   <Skeleton className="h-3 w-full" />
                 </div>
               </div>
             ))}
           </div>
        )}

        {!loading && !error && setmeals.length === 0 && (
          <div className="grid grid-cols-1 gap-5 pb-8">
            {dishes.map((dish, idx) => {
              const qty = getQuantity(dish.id);
              
              return (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={dish.id}
                  className="group relative flex gap-4 overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-zinc-50 transition-all hover:shadow-glow"
                >
                  {/* Image */}
                  <div className="relative aspect-square h-28 w-28 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-50">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-200">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 leading-tight">
                        {dish.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-400">
                        {dish.description || "Freshly prepared with premium ingredients."}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold text-zinc-900">
                        <span className="text-sm font-semibold text-primary align-top">€</span>
                        {dish.price.toFixed(2)}
                      </span>
                      
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 rounded-full bg-zinc-100 p-1">
                          <button
                            onClick={() => handleDecreaseDish(dish.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm transition-transform active:scale-90"
                          >
                            <Minus className="h-4 w-4" strokeWidth={3} />
                          </button>
                          <span className="min-w-[1.2rem] text-center text-sm font-bold text-zinc-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleAddDish(dish.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition-transform active:scale-90"
                          >
                            <Plus className="h-4 w-4" strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleAddDish(dish.id)}
                          className={clsx(
                            "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all",
                            animatingIds.has(dish.id)
                              ? "bg-green-500 text-white shadow-green-500/30" 
                              : "bg-zinc-900 text-white shadow-zinc-900/20 hover:bg-primary hover:shadow-primary/30"
                          )}
                        >
                           {animatingIds.has(dish.id) ? (
                             <ShoppingBag className="h-5 w-5" />
                           ) : (
                             <Plus className="h-5 w-5" strokeWidth={3} />
                           )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {!loading && !error && setmeals.length > 0 && (
          <div className="grid grid-cols-1 gap-5 pb-8">
            {setmeals.map((setmeal, idx) => {
              const qty = getSetmealQuantity(setmeal.id);

              return (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={setmeal.id}
                  className="group relative flex gap-4 overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-zinc-50 transition-all hover:shadow-glow"
                >
                  <div className="relative aspect-square h-28 w-28 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-50">
                    {setmeal.image ? (
                      <img
                        src={setmeal.image}
                        alt={setmeal.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-200">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 leading-tight">
                        {setmeal.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-400">
                        {setmeal.description || "Curated combo for great value."}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold text-zinc-900">
                        <span className="text-sm font-semibold text-primary align-top">€</span>
                        {setmeal.price.toFixed(2)}
                      </span>
                      
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 rounded-full bg-zinc-100 p-1">
                          <button
                            onClick={() => handleDecreaseSetmeal(setmeal.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm transition-transform active:scale-90"
                          >
                            <Minus className="h-4 w-4" strokeWidth={3} />
                          </button>
                          <span className="min-w-[1.2rem] text-center text-sm font-bold text-zinc-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleAddSetmeal(setmeal.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition-transform active:scale-90"
                          >
                            <Plus className="h-4 w-4" strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleAddSetmeal(setmeal.id)}
                          className={clsx(
                            "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all",
                            animatingIds.has(setmeal.id)
                              ? "bg-green-500 text-white shadow-green-500/30" 
                              : "bg-zinc-900 text-white shadow-zinc-900/20 hover:bg-primary hover:shadow-primary/30"
                          )}
                        >
                          {animatingIds.has(setmeal.id) ? (
                            <ShoppingBag className="h-5 w-5" />
                          ) : (
                            <Plus className="h-5 w-5" strokeWidth={3} />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Floating Cart Pill */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 right-auto z-40 flex w-full max-w-[430px] -translate-x-1/2 justify-center px-6"
          >
            <button
              onClick={() => navigate("/checkout")}
              className="relative flex w-full max-w-sm items-center justify-between overflow-hidden rounded-2xl bg-zinc-900 p-1.5 pl-5 pr-1.5 text-white shadow-xl shadow-zinc-900/30 ring-1 ring-white/10 backdrop-blur-md transition-transform active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
              
              <div className="relative flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{totalCount} items</span>
                <span className="text-lg font-bold">€{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="relative flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90">
                Checkout
                <ShoppingBag className="h-4 w-4 fill-white/20" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;

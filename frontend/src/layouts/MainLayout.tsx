import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { UtensilsCrossed, ClipboardList, User } from "lucide-react";
import { motion } from "framer-motion";

export const MainLayout = () => {
  return (
    // 使用新的 Mesh Gradient 背景
    <div className="flex min-h-screen w-full flex-col bg-background bg-mesh font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      
      {/* 
        主内容区域：
        padding-bottom 增加到 44 (11rem = 176px) 以防止底部导航栏 + 悬浮购物车遮挡内容
        同时为可能的浮动购物车预留空间
      */}
      <main className="flex-1 pb-44">
        <Outlet />
      </main>

      {/* Floating Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[430px] -translate-x-1/2 justify-center bg-gradient-to-t from-white/80 to-transparent pb-6 pt-4 pointer-events-none">
        <nav className="pointer-events-auto flex w-[90%] max-w-sm items-center justify-between rounded-3xl border border-white/40 bg-white/70 p-1.5 shadow-glass backdrop-blur-xl ring-1 ring-black/5">
          <TabLink to="/" icon={UtensilsCrossed} label="Menu" />
          <TabLink to="/orders" icon={ClipboardList} label="Orders" />
          <TabLink to="/profile" icon={User} label="Profile" />
        </nav>
      </div>
    </div>
  );
};

type TabLinkProps = {
  to: string;
  icon: React.ElementType;
  label: string;
};

const TabLink = ({ to, icon: Icon, label }: TabLinkProps) => {
  return (
    <NavLink
      to={to}
      className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-[20px] py-3.5 transition-all duration-300"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 rounded-[20px] bg-white shadow-sm ring-1 ring-black/5"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className={clsx(
            "z-10 flex h-6 w-6 items-center justify-center transition-transform duration-300",
            isActive ? "scale-110 text-primary" : "text-zinc-400"
          )}>
            <Icon 
              className="h-full w-full"
              strokeWidth={isActive ? 2.5 : 2}
            />
          </div>
          {/* 
            移除文字标签以保持极简（可选，或者仅在激活时显示）
            目前保留但做得非常小
          */}
          <span
            className={clsx(
              "z-10 text-[9px] font-bold uppercase tracking-wider transition-colors",
              isActive ? "text-primary" : "text-zinc-400"
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

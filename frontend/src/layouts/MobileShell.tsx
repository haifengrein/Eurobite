import { Outlet } from "react-router-dom";

export const MobileShell = () => {
  return (
    <div className="min-h-screen w-full bg-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background shadow-[0_20px_80px_-20px_rgba(0,0,0,0.35)]">
        <Outlet />
      </div>
    </div>
  );
};


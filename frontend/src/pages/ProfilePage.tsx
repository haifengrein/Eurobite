import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { MapPin, LogOut, ChevronRight, User, Settings, Heart } from "lucide-react";
import { clsx } from "clsx";

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const clearSession = useUserStore((state) => state.clearSession);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-background pb-28 pt-12">
      <div className="px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        
        {/* User Card */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 ring-4 ring-white">
            <User className="h-10 w-10 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || "Guest User"}</h2>
            <p className="text-sm text-muted-foreground">{user?.phone || "No phone linked"}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 px-4 space-y-6">
        {/* Group 1: Account */}
        <section>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h3>
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
             <ProfileLink 
               to="/addresses" 
               icon={MapPin} 
               label="My Addresses" 
               subLabel="Manage delivery locations"
             />
             <div className="h-px w-full bg-zinc-50 pl-14" />
             <ProfileLink 
               to="/orders" 
               icon={Heart} 
               label="Favorites" 
               subLabel="Your top dishes"
             />
          </div>
        </section>

        {/* Group 2: App */}
        <section>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">App Settings</h3>
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
             <div className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50">
               <div className="flex items-center gap-3">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-600">
                   <Settings className="h-4 w-4" />
                 </div>
                 <span className="font-medium">Notifications</span>
               </div>
               <div className="h-6 w-10 rounded-full bg-zinc-200 p-1">
                 <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
               </div>
             </div>
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 font-medium text-red-600 transition-colors active:scale-95"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
        
        <p className="text-center text-xs text-zinc-400 pt-4">EuroBite v2.0.0 (2025)</p>
      </div>
    </div>
  );
};

const ProfileLink = ({ to, icon: Icon, label, subLabel }: any) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <span className="block font-medium text-foreground">{label}</span>
          {subLabel && <span className="block text-xs text-muted-foreground">{subLabel}</span>}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-300" />
    </button>
  );
}

export default ProfilePage;
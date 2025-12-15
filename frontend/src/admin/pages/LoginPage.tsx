import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginEmployee } from '../api/auth';
import { ArrowRight, Loader2, Lock, User, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { clsx } from 'clsx';

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginEmployee({ username, password });

      if (res.data && res.data.code === 0) {
        const { token, employee } = res.data.data;
        if (token && employee) {
          setAuth(token, employee);
          showToast(`Welcome back, ${employee.name}!`);
          navigate('/admin/dashboard');
        } else {
          showToast('Login failed: Invalid server response');
        }
      } else {
        showToast(res.data?.msg || 'Login failed');
      }
    } catch (error: any) {
      showToast(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      {/* Left Side - Brand Visual */}
      <div className="hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 lg:flex relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20">
               E
             </div>
             <span className="text-xl font-bold text-white tracking-tight">EuroBite Admin</span>
          </div>
        </div>
        
        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight text-white tracking-tight">
            Manage your <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Kitchen Empire</span>
            <br/> with ease.
          </h1>
          <div className="space-y-4">
            {['Real-time Order Tracking', 'Inventory Management', 'Staff Coordination'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-orange-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-600 font-medium">
          <span>© 2025 EuroBite Inc.</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>v2.0.0 (Eagle)</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Sign in</h2>
            <p className="mt-2 text-zinc-500">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-zinc-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={clsx(
                "group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:translate-y-[-1px] active:scale-[0.98] disabled:opacity-70",
                loading && "cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

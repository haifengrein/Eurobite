import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { clsx } from 'clsx';
import Breadcrumb, { useBreadcrumb } from '../components/Breadcrumb';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChefHat
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { employee, clearAuth, hasPermission } = useAuthStore();

  // Safe breadcrumb items with fallback
  let breadcrumbItems = [];
  try {
    breadcrumbItems = useBreadcrumb();
  } catch (error) {
    console.error('Breadcrumb error:', error);
    breadcrumbItems = [];
  }

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  // Define menu items with required permissions
  const allNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard:read', roles: ['ADMIN', 'CHEF', 'STAFF'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, permission: 'orders:read', roles: ['ADMIN', 'CHEF', 'STAFF'] },
    { type: 'divider' },
    { name: 'Dishes', href: '/admin/dishes', icon: UtensilsCrossed, permission: 'dishes:read', roles: ['ADMIN', 'CHEF'] },
    { name: 'Setmeals', href: '/admin/setmeals', icon: Layers, permission: 'setmeals:read', roles: ['ADMIN', 'CHEF'] },
    { name: 'Categories', href: '/admin/categories', icon: Layers, permission: 'categories:read', roles: ['ADMIN', 'CHEF'] },
    { type: 'divider' },
    { name: 'Employees', href: '/admin/employees', icon: Users, permission: 'employees:read', roles: ['ADMIN'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, permission: 'settings:read', roles: ['ADMIN'] },
  ];

  // Filter menu items based on permissions with safe fallbacks
  const navItems = allNavItems.filter(item => {
    if (item.type === 'divider') return true;
    // Safe permission checking with fallbacks
    const userRole = employee?.role || 'STAFF';
    const hasRoleAccess = item.roles?.includes(userRole) || false;
    const hasPermissionAccess = item.permission ? (hasPermission?.(item.permission) ?? false) : true;
    return hasRoleAccess && hasPermissionAccess;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-white">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
               <ChefHat className="h-5 w-5" />
             </div>
             <span className="text-lg tracking-tight">EuroBite</span>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className="my-4 h-px bg-zinc-800" />;
            }
            const Icon = item.icon as React.ElementType;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-orange-500 text-white" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-sm font-semibold text-zinc-900">
                {navItems.find(i => i.href === location.pathname)?.name || 'Admin'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-medium text-zinc-900">{employee?.name || 'User'}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wide">{employee?.role || 'STAFF'}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-700">
                  {(employee?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          {/* Breadcrumb Navigation */}
          <div className="border-t border-zinc-200 px-6 py-3 bg-white">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

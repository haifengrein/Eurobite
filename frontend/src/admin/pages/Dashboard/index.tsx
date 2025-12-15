import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getDashboardData, type DashboardData } from '../../api/report';
import { useToast } from '@/components/ToastProvider';

// Generate chart data from recent orders
const generateChartData = (orders: DashboardData['recentOrders']) => {
  // Group orders by day of the week
  const dayData = [
    { name: 'Mon', total: 0 },
    { name: 'Tue', total: 0 },
    { name: 'Wed', total: 0 },
    { name: 'Thu', total: 0 },
    { name: 'Fri', total: 0 },
    { name: 'Sat', total: 0 },
    { name: 'Sun', total: 0 },
  ];

  orders.forEach(order => {
    const date = new Date(order.orderTime);
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayName = dayIndex === 0 ? 'Sun' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex];
    const dayDataIndex = dayData.findIndex(d => d.name === dayName);
    if (dayDataIndex !== -1) {
      dayData[dayDataIndex].total += Number(order.amount);
    }
  });

  return dayData;
};

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-500">{title}</span>
      <Icon className="h-4 w-4 text-zinc-400" />
    </div>
    <div className="mt-4 flex items-baseline gap-2">
      <span className="text-2xl font-bold tracking-tight text-zinc-900">{value}</span>
      {change && (
        <span className={clsx("flex items-center text-xs font-medium", trend === 'up' ? "text-green-600" : "text-red-600")}>
          {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
          {change}
        </span>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe useToast with fallback
  let showToast: (message: string) => void = () => {};
  try {
    const toast = useToast();
    showToast = toast?.showToast || (() => {});
  } catch (err) {
    console.error('ToastProvider error:', err);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getDashboardData();
        if (res && res.code === 0) {
          setData(res.data);
        } else {
          setError(res?.msg || 'Failed to load dashboard data');
          showToast(res?.msg || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Dashboard data loading error:', error);
        setError('Network error occurred');
        showToast('Network error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
          <p className="text-zinc-500">Overview of your restaurant's performance.</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600 font-medium">Error loading dashboard data</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              // Trigger reload
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Overview of your restaurant's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`€${Number(data?.totalRevenue ?? 0)}`}
          // change="12%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Orders"
          value={Number(data?.totalOrders ?? 0)}
          // change="5%"
          icon={ShoppingBag}
          trend="up"
        />
        <StatCard
          title="Total Customers"
          value={Number(data?.totalCustomers ?? 0)}
          // change="2%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Avg. Order Value"
          value={`€${Number(data?.avgOrderValue ?? 0)}`}
          // change="4%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart */}
        <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-base font-semibold text-zinc-900">Revenue Overview (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateChartData(data?.recentOrders || [])}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717A" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717A" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `€${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: '#F4F4F5' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-zinc-900">Recent Orders</h3>
          <div className="space-y-6">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 font-bold text-sm">
                      {order.userName ? order.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {order.userName || order.orderNumber}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(order.orderTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-zinc-900">
                    +€{order.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-zinc-500">No recent orders found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

const data = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 2100 },
  { name: 'Wed', total: 1800 },
  { name: 'Thu', total: 2400 },
  { name: 'Fri', total: 3200 },
  { name: 'Sat', total: 4500 },
  { name: 'Sun', total: 3800 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-500">{title}</span>
      <Icon className="h-4 w-4 text-zinc-400" />
    </div>
    <div className="mt-4 flex items-baseline gap-2">
      <span className="text-2xl font-bold tracking-tight text-zinc-900">{value}</span>
      <span className={clsx("flex items-center text-xs font-medium", trend === 'up' ? "text-green-600" : "text-red-600")}>
        {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
        {change}
      </span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Overview of your restaurant's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="€45,231" change="12%" icon={DollarSign} trend="up" />
        <StatCard title="Orders" value="+2,350" change="5%" icon={ShoppingBag} trend="up" />
        <StatCard title="Active Customers" value="+573" change="2%" icon={Users} trend="down" />
        <StatCard title="Avg. Order Value" value="€32.50" change="4%" icon={TrendingUp} trend="up" />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart */}
        <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-base font-semibold text-zinc-900">Revenue Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
          <h3 className="mb-4 text-base font-semibold text-zinc-900">Recent Sales</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 font-bold text-sm">
                    OM
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Olivia Martin</p>
                    <p className="text-xs text-zinc-500">olivia.martin@email.com</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-zinc-900">+€1,999.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

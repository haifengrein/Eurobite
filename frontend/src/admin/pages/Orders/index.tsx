import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Loader2, 
  Eye, 
  CheckCircle2, 
  Truck, 
  XCircle 
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { getOrderPage, updateOrderStatus, type Order } from '../../api/orders';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchId, setSearchId] = useState('');
  
  const { showToast } = useToast();
  const navigate = useNavigate();
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getOrderPage({ 
        page, 
        pageSize, 
        number: searchId || undefined 
      });
      if (res.code === 0 && res.data) {
        setOrders(res.data.content);
        setTotal(res.data.totalElements);
      } else {
        // showToast(res.msg || 'Failed to load orders');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, searchId]);

  const handleStatusChange = async (order: Order, newStatus: number) => {
    try {
      const res = await updateOrderStatus({ id: order.id, status: newStatus });
      if (res.code === 0) {
        showToast('Order status updated');
        loadData();
      } else {
        showToast(res.msg || 'Operation failed');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: return <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">Pending Payment</span>;
      case 2: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Waiting Acceptance</span>;
      case 3: return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Accepted</span>;
      case 4: return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Delivering</span>;
      case 5: return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Completed</span>;
      case 6: return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Cancelled</span>;
      default: return <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Orders</h2>
          <p className="text-zinc-500">Monitor and manage customer orders.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="h-10 w-full rounded-md border border-zinc-200 bg-transparent pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{order.number}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      {order.orderTime ? new Date(order.orderTime).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{order.consignee || 'Guest'}</span>
                        <span className="text-xs">{order.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">€{order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 2 && (
                          <button 
                            onClick={() => handleStatusChange(order, 3)}
                            className="rounded-md p-2 text-blue-500 hover:bg-blue-50"
                            title="Accept Order"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {order.status === 3 && (
                          <button 
                            onClick={() => handleStatusChange(order, 4)}
                            className="rounded-md p-2 text-orange-500 hover:bg-orange-50"
                            title="Start Delivery"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        {order.status === 4 && (
                          <button 
                            onClick={() => handleStatusChange(order, 5)}
                            className="rounded-md p-2 text-green-500 hover:bg-green-50"
                            title="Complete Order"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status < 5 && (
                          <button 
                            onClick={() => handleStatusChange(order, 6)}
                            className="rounded-md p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <div className="text-sm text-zinc-500">
            Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, total)}</span> of <span className="font-medium">{total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * pageSize >= total}
              className="rounded-md border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

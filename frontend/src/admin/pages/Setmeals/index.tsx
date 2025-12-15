import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { getSetmealPage, deleteSetmeal, updateSetmealStatus, type Setmeal } from '../../api/setmeal';
import { getImageUrl } from '../../api/common';
import { clsx } from 'clsx';
import SetmealForm from './Form';

const SetmealList: React.FC = () => {
  const [setmeals, setSetmeals] = useState<Setmeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  
  // Dialog State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { showToast } = useToast();
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSetmealPage({ 
        page, 
        pageSize, 
        name: searchName || undefined 
      });
      if (res.code === 0 && res.data) {
        setSetmeals(res.data.content);
        setTotal(res.data.totalElements);
      } else {
        // showToast(res.msg || 'Failed to load setmeals');
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
  }, [page, searchName]);

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm('Are you sure you want to delete selected setmeal(s)?')) return;
    
    try {
      const res = await deleteSetmeal(ids);
      if (res.code === 0) {
        showToast('Setmeal deleted successfully');
        loadData();
      } else {
        showToast(res.msg || 'Operation failed');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  const handleStatusChange = async (status: number, ids: string[]) => {
    try {
      const res = await updateSetmealStatus(status, ids);
      if (res.code === 0) {
        showToast('Status updated');
        loadData();
      } else {
        showToast(res.msg || 'Operation failed');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleFormClose = (refresh?: boolean) => {
    setShowForm(false);
    setEditingId(null);
    if (refresh) {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Setmeals</h2>
          <p className="text-zinc-500">Manage value combos and promotions.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Setmeal
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search setmeals..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
                <th className="px-6 py-4 font-medium w-16">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
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
              ) : setmeals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No setmeals found.
                  </td>
                </tr>
              ) : (
                setmeals.map((setmeal) => (
                  <tr key={setmeal.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {setmeal.image ? (
                        <img 
                          src={getImageUrl(setmeal.image)} 
                          alt={setmeal.name} 
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{setmeal.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{setmeal.categoryName || '-'}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">€{setmeal.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleStatusChange(setmeal.status === 1 ? 0 : 1, [setmeal.id])}
                        className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                          setmeal.status === 1 
                            ? "bg-green-50 text-green-700 hover:bg-green-100" 
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        )}
                      >
                        {setmeal.status === 1 ? 'On Sale' : 'Off Shelf'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(setmeal.id)}
                          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete([setmeal.id])}
                          className="rounded-md p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      {/* Form Modal */}
      {showForm && (
        <SetmealForm 
          id={editingId} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default SetmealList;

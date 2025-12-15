import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { getCategoryPage, deleteCategory, type Category } from '../../api/category';
import { clsx } from 'clsx';
import CategoryForm from './Form';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
  // Dialog State
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { showToast } = useToast();
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getCategoryPage({ page, pageSize });
      if (res.code === 0 && res.data) {
        setCategories(res.data.content);
        setTotal(res.data.totalElements);
      } else {
        // showToast(res.msg || 'Failed to load categories');
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
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await deleteCategory(id);
      if (res.code === 0) {
        showToast('Category deleted successfully');
        loadData();
      } else {
        showToast(res.msg || 'Operation failed');
      }
    } catch (error) {
      showToast('Network error');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleFormClose = (refresh?: boolean) => {
    setShowForm(false);
    setEditingCategory(null);
    if (refresh) {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Categories</h2>
          <p className="text-zinc-500">Manage dish and setmeal categories.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Sort Order</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{category.name}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        category.type === 1 
                          ? "bg-blue-50 text-blue-700" 
                          : "bg-purple-50 text-purple-700"
                      )}>
                        {category.type === 1 ? 'Dish Category' : 'Setmeal Category'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{category.sort}</td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {category.updateTime ? new Date(category.updateTime).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
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
        <CategoryForm 
          initialData={editingCategory} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default CategoryList;

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { addCategory, updateCategory, type Category } from '../../api/category';
import { clsx } from 'clsx';

interface CategoryFormProps {
  initialData: Category | null;
  onClose: (refresh?: boolean) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Category>>(initialData || {
    name: '',
    type: 1, // Default Dish Category
    sort: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const api = initialData ? updateCategory : addCategory;
      const payload = initialData ? { ...formData, id: initialData.id } : formData;
      
      const res = await api(payload);
      if (res.code === 0) {
        showToast(`Category ${initialData ? 'updated' : 'added'} successfully`);
        onClose(true);
      } else {
        showToast(res.msg || 'Operation failed');
      }
    } catch (error) {
      showToast('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            {initialData ? 'Edit Category' : 'Add Category'}
          </h3>
          <button 
            onClick={() => onClose()}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="e.g. Beverages"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Type</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={clsx(
                "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all",
                formData.type === 1 
                  ? "border-orange-500 bg-orange-50 text-orange-700" 
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}>
                <input 
                  type="radio" 
                  name="type" 
                  value="1" 
                  checked={formData.type === 1}
                  onChange={() => setFormData({ ...formData, type: 1 })}
                  className="sr-only"
                />
                Dish Category
              </label>
              <label className={clsx(
                "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all",
                formData.type === 2 
                  ? "border-orange-500 bg-orange-50 text-orange-700" 
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}>
                <input 
                  type="radio" 
                  name="type" 
                  value="2" 
                  checked={formData.type === 2}
                  onChange={() => setFormData({ ...formData, type: 2 })}
                  className="sr-only"
                />
                Setmeal Category
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Sort Order</label>
            <input
              type="number"
              required
              value={formData.sort}
              onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="0"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 mt-6">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={clsx(
                "flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors",
                submitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;

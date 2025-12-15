import React, { useEffect, useState } from 'react';
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { addDish, updateDish, getDishById, type Dish, type DishFlavor } from '../../api/dish';
import { getCategoryList, type Category } from '../../api/category';
import { uploadFile, getImageUrl } from '../../api/common';
import { clsx } from 'clsx';

interface DishFormProps {
  id: string | null;
  onClose: (refresh?: boolean) => void;
}

const DishForm: React.FC<DishFormProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Dish>>({
    name: '',
    categoryId: '',
    price: 0,
    code: '',
    image: '',
    description: '',
    status: 1,
    flavors: [],
  });

  useEffect(() => {
    loadCategories();
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList(1); // 1 = Dish Category
      if (res.code === 0 && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async (dishId: string) => {
    setLoading(true);
    try {
      const res = await getDishById(dishId);
      if (res.code === 0 && res.data) {
        setFormData(res.data);
      } else {
        showToast(res.msg || 'Failed to load dish details');
        onClose();
      }
    } catch (error) {
      showToast('Network error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadFile(file);
      if (res.code === 0 && res.data) {
        setFormData(prev => ({ ...prev, image: res.data }));
      } else {
        showToast('Upload failed');
      }
    } catch (error) {
      showToast('Upload error');
    }
  };

  const handleAddFlavor = () => {
    setFormData(prev => ({
      ...prev,
      flavors: [...(prev.flavors || []), { name: '', value: '[]' }]
    }));
  };

  const handleRemoveFlavor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      flavors: prev.flavors?.filter((_, i) => i !== index)
    }));
  };

  const handleFlavorChange = (index: number, field: keyof DishFlavor, value: string) => {
    setFormData(prev => ({
      ...prev,
      flavors: prev.flavors?.map((f, i) => i === index ? { ...f, [field]: value } : f)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const api = id ? updateDish : addDish;
      const payload = id ? { ...formData, id } : formData;
      
      const res = await api(payload);
      if (res.code === 0) {
        showToast(`Dish ${id ? 'updated' : 'added'} successfully`);
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-lg bg-white p-8">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            {id ? 'Edit Dish' : 'Add Dish'}
          </h3>
          <button 
            onClick={() => onClose()}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Price (€)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Status</label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="1" 
                    checked={formData.status === 1}
                    onChange={() => setFormData({ ...formData, status: 1 })}
                    className="text-orange-600 focus:ring-orange-500" 
                  />
                  <span className="text-sm text-zinc-700">On Sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="0" 
                    checked={formData.status === 0}
                    onChange={() => setFormData({ ...formData, status: 0 })}
                    className="text-orange-600 focus:ring-orange-500" 
                  />
                  <span className="text-sm text-zinc-700">Off Shelf</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Image</label>
            <div className="flex items-start gap-4">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                {formData.image ? (
                  <img 
                    src={getImageUrl(formData.image)} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
              <div className="text-sm text-zinc-500 pt-2">
                <p>Click to upload dish image.</p>
                <p>Supports: JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Flavors</label>
              <button
                type="button"
                onClick={handleAddFlavor}
                className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
              >
                <Plus className="h-3 w-3" />
                Add Flavor
              </button>
            </div>
            
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
              {(!formData.flavors || formData.flavors.length === 0) && (
                <div className="text-center text-xs text-zinc-400 py-2">
                  No flavors added (e.g., Spiciness, Sweetness).
                </div>
              )}
              {formData.flavors?.map((flavor, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Name (e.g. Spiciness)"
                    value={flavor.name}
                    onChange={(e) => handleFlavorChange(idx, 'name', e.target.value)}
                    className="h-9 w-1/3 rounded-md border border-zinc-200 px-3 text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Values (e.g. [Mild, Hot])"
                    value={flavor.value}
                    onChange={(e) => handleFlavorChange(idx, 'value', e.target.value)}
                    className="h-9 flex-1 rounded-md border border-zinc-200 px-3 text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFlavor(idx)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
              {id ? 'Save Changes' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishForm;

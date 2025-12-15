import React, { useEffect, useState } from 'react';
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { addSetmeal, updateSetmeal, getSetmealById, type Setmeal, type SetmealDish } from '../../api/setmeal';
import { getCategoryList, type Category } from '../../api/category';
import { getDishList, type Dish } from '../../api/dish';
import { uploadFile, getImageUrl } from '../../api/common';
import { clsx } from 'clsx';

interface SetmealFormProps {
  id: string | null;
  onClose: (refresh?: boolean) => void;
}

const SetmealForm: React.FC<SetmealFormProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Setmeal>>({
    name: '',
    categoryId: '',
    price: 0,
    code: '',
    image: '',
    description: '',
    status: 1,
    setmealDishes: [],
  });

  useEffect(() => {
    loadCategories();
    loadDishes();
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList(2); // 2 = Setmeal Category
      if (res.code === 0 && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadDishes = async () => {
    try {
      const res = await getDishList(); // Fetch all dishes
      if (res.code === 0 && res.data) {
        setAvailableDishes(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async (setmealId: string) => {
    setLoading(true);
    try {
      const res = await getSetmealById(setmealId);
      if (res.code === 0 && res.data) {
        setFormData(res.data);
      } else {
        showToast(res.msg || 'Failed to load setmeal details');
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

  const handleAddDish = () => {
    if (!selectedDishId) return;
    const dish = availableDishes.find(d => d.id === selectedDishId);
    if (!dish) return;

    // Check if already exists
    if (formData.setmealDishes?.some(d => d.dishId === dish.id)) {
      showToast('Dish already in setmeal');
      return;
    }

    setFormData(prev => ({
      ...prev,
      setmealDishes: [...(prev.setmealDishes || []), {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        copies: 1
      }]
    }));
    setSelectedDishId('');
  };

  const handleRemoveDish = (index: number) => {
    setFormData(prev => ({
      ...prev,
      setmealDishes: prev.setmealDishes?.filter((_, i) => i !== index)
    }));
  };

  const handleDishCopiesChange = (index: number, copies: number) => {
    if (copies < 1) return;
    setFormData(prev => ({
      ...prev,
      setmealDishes: prev.setmealDishes?.map((d, i) => i === index ? { ...d, copies } : d)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const api = id ? updateSetmeal : addSetmeal;
      const payload = id ? { ...formData, id } : formData;
      
      const res = await api(payload);
      if (res.code === 0) {
        showToast(`Setmeal ${id ? 'updated' : 'added'} successfully`);
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
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            {id ? 'Edit Setmeal' : 'Add Setmeal'}
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
              <label className="text-sm font-medium text-zinc-700">Setmeal Name</label>
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
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-zinc-700">Dishes in Setmeal</label>
             <div className="flex gap-2">
               <select 
                 className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                 value={selectedDishId}
                 onChange={(e) => setSelectedDishId(e.target.value)}
               >
                 <option value="">Select a Dish to Add</option>
                 {availableDishes.map(d => (
                   <option key={d.id} value={d.id}>{d.name} - €{d.price}</option>
                 ))}
               </select>
               <button 
                 type="button"
                 onClick={handleAddDish}
                 disabled={!selectedDishId}
                 className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
               >
                 Add
               </button>
             </div>

             {/* Dish Table */}
             <div className="rounded-lg border border-zinc-200 overflow-hidden">
               <table className="w-full text-sm">
                 <thead className="bg-zinc-50 text-zinc-500">
                   <tr>
                     <th className="px-4 py-2 text-left font-medium">Name</th>
                     <th className="px-4 py-2 text-left font-medium">Price</th>
                     <th className="px-4 py-2 text-left font-medium">Copies</th>
                     <th className="px-4 py-2 text-right font-medium">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100">
                   {formData.setmealDishes?.length === 0 && (
                     <tr>
                       <td colSpan={4} className="p-4 text-center text-zinc-400">No dishes added.</td>
                     </tr>
                   )}
                   {formData.setmealDishes?.map((dish, idx) => (
                     <tr key={idx}>
                       <td className="px-4 py-2">{dish.name}</td>
                       <td className="px-4 py-2">€{dish.price}</td>
                       <td className="px-4 py-2">
                         <div className="flex items-center gap-2">
                           <button 
                             type="button" 
                             onClick={() => handleDishCopiesChange(idx, dish.copies - 1)}
                             className="h-6 w-6 rounded bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"
                           >
                             -
                           </button>
                           <span className="w-4 text-center">{dish.copies}</span>
                           <button 
                             type="button" 
                             onClick={() => handleDishCopiesChange(idx, dish.copies + 1)}
                             className="h-6 w-6 rounded bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"
                           >
                             +
                           </button>
                         </div>
                       </td>
                       <td className="px-4 py-2 text-right">
                         <button 
                           type="button"
                           onClick={() => handleRemoveDish(idx)}
                           className="text-red-500 hover:text-red-700"
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
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
              {id ? 'Save Changes' : 'Add Setmeal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetmealForm;

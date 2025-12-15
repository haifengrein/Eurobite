import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { addEmployee, updateEmployee, getEmployeeById, type Employee } from '../../api/employee';
import { clsx } from 'clsx';

interface EmployeeFormProps {
  id: string | null;
  onClose: (refresh?: boolean) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Employee>>({
    username: '',
    name: '',
    phone: '',
    sex: '1', // 1: Male, 0: Female
    role: 'STAFF', // Default role
  });

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (employeeId: string) => {
    setLoading(true);
    try {
      const res = await getEmployeeById(employeeId);
      if (res.code === 0 && res.data) {
        setFormData(res.data);
      } else {
        showToast(res.msg || 'Failed to load employee details');
        onClose();
      }
    } catch (error) {
      showToast('Network error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const api = id ? updateEmployee : addEmployee;
      const payload = id ? { ...formData, id } : formData;
      
      const res = await api(payload);
      if (res.code === 0) {
        showToast(`Employee ${id ? 'updated' : 'added'} successfully`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            {id ? 'Edit Employee' : 'Add Employee'}
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
            <label className="text-sm font-medium text-zinc-700">Username</label>
            <input
              type="text"
              required
              disabled={!!id} // Username usually not editable or handled carefully
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50 disabled:bg-zinc-50"
              placeholder="jdoe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="13800138000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Gender</label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="1"
                  checked={formData.sex === '1'}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-zinc-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value="0"
                  checked={formData.sex === '0'}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-zinc-700">Female</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Role</label>
            <select
              value={formData.role || 'STAFF'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'CHEF' | 'STAFF' })}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              required
            >
              <option value="STAFF">Staff - Basic access to orders</option>
              <option value="CHEF">Chef - Can manage dishes and setmeals</option>
              <option value="ADMIN">Admin - Full system access</option>
            </select>
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
              {id ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

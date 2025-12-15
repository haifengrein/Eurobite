import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  UserX, 
  UserCheck, 
  Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { getEmployeePage, updateEmployee, type Employee } from '../../api/employee';
import { clsx } from 'clsx';
import EmployeeForm from './Form';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      const res = await getEmployeePage({ 
        page, 
        pageSize, 
        name: searchName || undefined 
      });
      if (res.code === 0 && res.data) {
        setEmployees(res.data.content);
        setTotal(res.data.totalElements);
      } else {
        // showToast(res.msg || 'Failed to load employees');
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
  }, [page, searchName]); // Reload when page or search changes

  const handleStatusChange = async (employee: Employee) => {
    const newStatus = employee.status === 1 ? 0 : 1;
    try {
      const res = await updateEmployee({ ...employee, status: newStatus });
      if (res.code === 0) {
        showToast(`Employee ${newStatus === 1 ? 'enabled' : 'disabled'} successfully`);
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
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Employees</h2>
          <p className="text-zinc-500">Manage your restaurant staff and permissions.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search employees by name..."
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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Status</th>
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
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{employee.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{employee.username}</td>
                    <td className="px-6 py-4 text-zinc-600">{employee.phone}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        employee.status === 1 
                          ? "bg-green-50 text-green-700" 
                          : "bg-red-50 text-red-700"
                      )}>
                        {employee.status === 1 ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(employee.id)}
                          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(employee)}
                          className={clsx(
                            "rounded-md p-2 transition-colors",
                            employee.status === 1 
                              ? "text-red-400 hover:bg-red-50 hover:text-red-600" 
                              : "text-green-400 hover:bg-green-50 hover:text-green-600"
                          )}
                          title={employee.status === 1 ? "Disable" : "Enable"}
                        >
                          {employee.status === 1 ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
        <EmployeeForm 
          id={editingId} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default EmployeeList;

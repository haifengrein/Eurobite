import React, { useMemo, useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye } from 'lucide-react';
import { clsx } from 'clsx';

type Order = {
  id: string;
  orderNo: string;
  status: 'Pending' | 'Paid' | 'Cooking' | 'Completed' | 'Cancelled';
  customer: string;
  amount: number;
  date: string;
};

const data: Order[] = [
  { id: '1', orderNo: '#3210', status: 'Pending', customer: 'Ken99', amount: 316.00, date: '2025-12-09' },
  { id: '2', orderNo: '#3209', status: 'Cooking', customer: 'Abe45', amount: 242.00, date: '2025-12-09' },
  { id: '3', orderNo: '#3208', status: 'Completed', customer: 'Monserrat44', amount: 837.00, date: '2025-12-08' },
  { id: '4', orderNo: '#3207', status: 'Paid', customer: 'Silas22', amount: 874.00, date: '2025-12-08' },
];

const columnHelper = createColumnHelper<Order>();

const OrderList: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => [
    columnHelper.accessor('orderNo', {
      header: 'Order',
      cell: info => <span className="font-medium text-zinc-900">{info.getValue()}</span>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const styles = {
          Pending: 'bg-orange-50 text-orange-700 border-orange-200',
          Paid: 'bg-blue-50 text-blue-700 border-blue-200',
          Cooking: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          Completed: 'bg-green-50 text-green-700 border-green-200',
          Cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
        };
        return (
          <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", styles[status])}>
            {status}
          </span>
        );
      }
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => `€${info.getValue().toFixed(2)}`
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => <span className="text-zinc-500">{info.getValue()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="flex justify-end">
           <button className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
             <MoreHorizontal className="h-4 w-4" />
           </button>
        </div>
      )
    })
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Orders</h2>
          <p className="text-zinc-500">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              placeholder="Filter orders..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 pl-8 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 data-[state=selected]:bg-zinc-50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="h-12 px-4 align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 data-[state=selected]:bg-zinc-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 p-4">
          <button
            className="rounded-lg border p-2 hover:bg-zinc-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg border p-2 hover:bg-zinc-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

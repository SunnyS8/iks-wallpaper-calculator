import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { RemnantLine } from '@/types/calculation';

const columnHelper = createColumnHelper<RemnantLine>();

const columns = [
  columnHelper.accessor('name', { header: 'Остаток материала' }),
  columnHelper.accessor('unit', { header: 'Ед. изм.' }),
  columnHelper.accessor('leftoverQty', {
    header: 'Кол-во остатка',
    cell: (info) => info.getValue().toLocaleString('ru-RU', { maximumFractionDigits: 2 }),
  }),
  columnHelper.accessor('totalRub', {
    header: 'Остаток, ₽',
    cell: (info) => info.getValue().toLocaleString('ru-RU', { minimumFractionDigits: 2 }),
  }),
];

interface RemnantsTableProps {
  remnants: RemnantLine[];
  totalRub: number;
}

export function RemnantsTable({ remnants, totalRub }: RemnantsTableProps) {
  const table = useReactTable({
    data: remnants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (remnants.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 overflow-x-auto">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Справочно — остатки материалов</h2>
      <table className="min-w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
        <thead className="bg-slate-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-slate-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-semibold">
            <td colSpan={3} className="px-4 py-3 text-right">
              Итого остаток в рублях
            </td>
            <td className="px-4 py-3">
              {totalRub.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

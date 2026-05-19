import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { MaterialLine } from '@/types/calculation';

const columnHelper = createColumnHelper<MaterialLine>();

const columns = [
  columnHelper.accessor('name', { header: 'Наименование материала' }),
  columnHelper.accessor('unit', { header: 'Ед. изм.' }),
  columnHelper.accessor('quantity', {
    header: 'Кол-во',
    cell: (info) => info.getValue().toLocaleString('ru-RU', { maximumFractionDigits: 2 }),
  }),
  columnHelper.accessor('unitPrice', {
    header: 'Цена за ед., ₽',
    cell: (info) =>
      info.getValue() > 0
        ? info.getValue().toLocaleString('ru-RU', { minimumFractionDigits: 2 })
        : '—',
  }),
  columnHelper.accessor('total', {
    header: 'Сумма, ₽',
    cell: (info) =>
      info.getValue() > 0
        ? info.getValue().toLocaleString('ru-RU', { minimumFractionDigits: 2 })
        : 'по запросу',
  }),
];

interface SpecificationTableProps {
  materials: MaterialLine[];
  grandTotal: number;
}

export function SpecificationTable({ materials, grandTotal }: SpecificationTableProps) {
  const table = useReactTable({
    data: materials,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (materials.length === 0) {
    return <p className="text-sm text-slate-500">Нет данных. Нажмите «Рассчитать».</p>;
  }

  return (
    <section className="overflow-x-auto">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Спецификация материалов</h2>
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
            <tr key={row.id} className="hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-slate-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  {row.original.note && cell.column.id === 'name' && (
                    <p className="mt-0.5 text-xs text-slate-500">{row.original.note}</p>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-brand-50 font-semibold">
            <td colSpan={4} className="px-4 py-3 text-right text-slate-800">
              Итого с НДС 22%
            </td>
            <td className="px-4 py-3 text-slate-900">
              {grandTotal.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

import { Trash2 } from 'lucide-react';
import { SOCKET_INSERT_TYPES } from '@/constants/catalogs';
import type { SocketPoint } from '@/types/wall';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/NumberField';

interface SocketPointRowProps {
  point: SocketPoint;
  canRemove: boolean;
  onChange: (point: SocketPoint) => void;
  onRemove: () => void;
}

export function SocketPointRow({ point, canRemove, onChange, onRemove }: SocketPointRowProps) {
  return (
    <article className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[2fr_1fr_auto]">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Тип закладной</span>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={point.type}
          onChange={(e) => onChange({ ...point, type: Number(e.target.value) as SocketPoint['type'] })}
        >
          {SOCKET_INSERT_TYPES.map((t) => (
            <option key={t.type} value={t.type}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <NumberField
        label="Количество точек"
        value={point.count}
        onChange={(count) => onChange({ ...point, count: Math.max(0, Math.floor(count)) })}
        step={1}
        min={0}
      />
      <Button
        type="button"
        variant="ghost"
        className="self-end"
        disabled={!canRemove}
        onClick={onRemove}
        aria-label="Удалить строку"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </article>
  );
}

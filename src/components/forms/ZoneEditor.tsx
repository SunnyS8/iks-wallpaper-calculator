import { Plus, Trash2 } from 'lucide-react';
import { ROLL_WIDTHS } from '@/constants/catalogs';
import type { Zone } from '@/types/wall';
import { Button } from '@/components/ui/Button';
import { NumberField } from '@/components/ui/NumberField';
import { createId } from '@/lib/createId';

interface ZoneEditorProps {
  zones: Zone[];
  wallLength: number;
  onChange: (zones: Zone[]) => void;
}

function newZone(index: number): Zone {
  return {
    id: createId(),
    label: `Зона ${index}`,
    length: 1,
    rollWidth: 2.8,
  };
}

export function ZoneEditor({ zones, wallLength, onChange }: ZoneEditorProps) {
  const zonesSum = zones.reduce((s, z) => s + z.length, 0);
  const sumWarning =
    Math.abs(zonesSum - wallLength) > 0.05
      ? `Сумма зон (${zonesSum.toFixed(2)} м) отличается от длины стены (${wallLength.toFixed(2)} м)`
      : undefined;

  const updateZone = (id: string, patch: Partial<Zone>) => {
    onChange(zones.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  };

  return (
    <section className="mt-4 space-y-3 rounded-lg border border-dashed border-slate-300 p-4">
      <header className="flex items-center justify-between">
        <h4 className="font-medium text-slate-800">Зоны стены</h4>
        <Button
          type="button"
          variant="secondary"
          className="text-xs"
          onClick={() => onChange([...zones, newZone(zones.length + 1)])}
        >
          <Plus className="h-4 w-4" />
          Зона
        </Button>
      </header>
      {sumWarning && <p className="text-xs text-amber-700">{sumWarning}</p>}
      {zones.map((zone, index) => (
        <article
          key={zone.id}
          className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Название</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={zone.label ?? ''}
              onChange={(e) => updateZone(zone.id, { label: e.target.value })}
            />
          </label>
          <NumberField
            label="Длина зоны, м"
            value={zone.length}
            onChange={(length) => updateZone(zone.id, { length })}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Ширина рулона, м</span>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={zone.rollWidth}
              onChange={(e) =>
                updateZone(zone.id, { rollWidth: Number(e.target.value) as Zone['rollWidth'] })
              }
            >
              {ROLL_WIDTHS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            variant="ghost"
            className="self-end"
            disabled={zones.length <= 2}
            onClick={() => onChange(zones.filter((z) => z.id !== zone.id))}
            aria-label={`Удалить зону ${index + 1}`}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </article>
      ))}
    </section>
  );
}

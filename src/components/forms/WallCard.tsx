import { Trash2 } from 'lucide-react';
import { ROLL_WIDTHS } from '@/constants/catalogs';
import type { Wall } from '@/types/wall';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import { ZoneEditor } from './ZoneEditor';
import { ProfileInputsGrid } from './ProfileInputsGrid';

interface WallCardProps {
  wall: Wall;
  canRemove: boolean;
  showProfiles?: boolean;
  onChange: (wall: Wall) => void;
  onRemove: () => void;
}

export function WallCard({
  wall,
  canRemove,
  showProfiles = false,
  onChange,
  onRemove,
}: WallCardProps) {
  const patch = (p: Partial<Wall>) => onChange({ ...wall, ...p });

  return (
    <Card className="relative">
      <header className="mb-4 flex items-start justify-between gap-2">
        <CardTitle>{wall.label}</CardTitle>
        {canRemove && (
          <Button type="button" variant="ghost" onClick={onRemove} aria-label="Удалить стену">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        )}
      </header>

      <label className="mb-4 block text-sm">
        <span className="font-medium text-slate-700">Название стены</span>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={wall.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Длина стены L, м"
          value={wall.lengthL}
          onChange={(lengthL) => patch({ lengthL })}
        />
        <NumberField
          label="Высота стены H, м"
          value={wall.heightH}
          onChange={(heightH) => patch({ heightH })}
          error={
            wall.drapingMode === 'single' && wall.heightH > wall.rollWidth
              ? 'Высота больше ширины рулона'
              : undefined
          }
        />
      </div>

      <fieldset className="mt-4 space-y-2">
        <legend className="text-sm font-medium text-slate-700">Драпировка</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`draping-${wall.id}`}
            checked={wall.drapingMode === 'single'}
            onChange={() => patch({ drapingMode: 'single' })}
          />
          Один артикул на всю стену
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`draping-${wall.id}`}
            checked={wall.drapingMode === 'zoned'}
            onChange={() => patch({ drapingMode: 'zoned' })}
          />
          Зонирование
        </label>
      </fieldset>

      {wall.drapingMode === 'single' ? (
        <label className="mt-4 block text-sm">
          <span className="font-medium text-slate-700">Ширина рулона, м</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={wall.rollWidth}
            onChange={(e) => patch({ rollWidth: Number(e.target.value) as Wall['rollWidth'] })}
          >
            {ROLL_WIDTHS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <ZoneEditor
          zones={wall.zones}
          wallLength={wall.lengthL}
          onChange={(zones) => patch({ zones })}
        />
      )}

      {showProfiles && (
        <>
          <NumberField
            label="Доп. метраж базового профиля для проёмов (АП 5994), м"
            value={wall.openingsBaseMeters}
            onChange={(openingsBaseMeters) => patch({ openingsBaseMeters })}
            hint="Обход оконных и дверных проёмов"
          />
          <ProfileInputsGrid
            wall={wall}
            onChange={(profileMeters) => patch({ profileMeters })}
          />
        </>
      )}
    </Card>
  );
}

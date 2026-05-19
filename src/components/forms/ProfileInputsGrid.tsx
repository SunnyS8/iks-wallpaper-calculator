import { PROFILES, type ProfileSku } from '@/constants/catalogs';
import { separatorMetersForWall } from '@/lib/calculations/calculateSeparator';
import type { Wall } from '@/types/wall';
import { NumberField } from '@/components/ui/NumberField';

interface ProfileInputsGridProps {
  wall: Wall;
  onChange: (profileMeters: Record<ProfileSku, number>) => void;
}

export function ProfileInputsGrid({ wall, onChange }: ProfileInputsGridProps) {
  const perimeter = ((wall.lengthL + wall.heightH) * 2).toFixed(2);
  const autoSeparator = separatorMetersForWall(wall);

  const setProfile = (sku: ProfileSku, value: number) => {
    onChange({ ...wall.profileMeters, [sku]: value });
  };

  return (
    <section className="mt-4">
      <p className="mb-3 text-sm text-slate-600">
        Периметр стены (справочно): <strong>{perimeter} м</strong>. Ламель профиля = 2 пог. м.
        {wall.drapingMode === 'zoned' && autoSeparator > 0 && (
          <>
            {' '}
            Разделительный профиль (АП 5999) при зонировании:{' '}
            <strong>{autoSeparator} м</strong> (добавляется к расчёту автоматически).
          </>
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROFILES.map((profile) => (
          <NumberField
            key={profile.sku}
            label={`${profile.name} (${profile.article})`}
            value={wall.profileMeters[profile.sku]}
            onChange={(v) => setProfile(profile.sku, v)}
            hint="Метраж, м"
          />
        ))}
      </div>
    </section>
  );
}

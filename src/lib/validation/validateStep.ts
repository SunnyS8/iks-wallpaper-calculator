import { wallGeometrySchema, wallMaterialsSchema } from './schemas';
import type { Wall } from '@/types/wall';

export function validateGeometryStep(walls: Wall[]): string | null {
  for (const wall of walls) {
    const parsed = wallGeometrySchema.safeParse(wall);
    if (!parsed.success) {
      return parsed.error.errors[0]?.message ?? 'Ошибка в геометрии стены';
    }
    if (wall.drapingMode === 'single' && wall.heightH > wall.rollWidth + 1e-6) {
      return `${wall.label}: высота больше ширины рулона`;
    }
    if (wall.drapingMode === 'zoned' && wall.zones.length < 2) {
      return `${wall.label}: добавьте минимум 2 зоны`;
    }
  }
  return null;
}

export function validateMaterialsStep(walls: Wall[]): string | null {
  for (const wall of walls) {
    const parsed = wallMaterialsSchema.safeParse({
      id: wall.id,
      drapingMode: wall.drapingMode,
      rollWidth: wall.rollWidth,
      heightH: wall.heightH,
      zones: wall.zones,
      profileMeters: wall.profileMeters,
      openingsBaseMeters: wall.openingsBaseMeters,
    });
    if (!parsed.success) {
      return parsed.error.errors[0]?.message ?? `Ошибка материалов: ${wall.label}`;
    }
  }
  return null;
}

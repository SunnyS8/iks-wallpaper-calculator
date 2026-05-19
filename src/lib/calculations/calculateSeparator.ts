import type { Wall } from '@/types/wall';
import { round2 } from '@/lib/math';

/** Метраж разделительного профиля при зонировании: (зон − 1) × высота */
export function separatorMetersForWall(wall: Wall): number {
  if (wall.drapingMode !== 'zoned' || wall.zones.length < 2) {
    return 0;
  }
  return round2((wall.zones.length - 1) * wall.heightH);
}

export function totalSeparatorMeters(walls: Wall[]): number {
  return round2(walls.reduce((sum, w) => sum + separatorMetersForWall(w), 0));
}

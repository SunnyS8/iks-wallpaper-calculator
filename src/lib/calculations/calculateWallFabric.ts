import { CUT_ALLOWANCE } from '@/constants/limits';
import type { Wall } from '@/types/wall';
import type { FabricPiece } from '@/types/calculation';
import { round2 } from '@/lib/math';

/** Итоговая длина отреза с технологическим допуском */
export function getCutLength(lengthM: number): number {
  return round2(lengthM + CUT_ALLOWANCE);
}

export function fabricPiecesFromWall(wall: Wall): FabricPiece[] {
  if (wall.drapingMode === 'single') {
    const cutLength = getCutLength(wall.lengthL);
    return [
      {
        wallId: wall.id,
        wallLabel: wall.label,
        rollWidth: wall.rollWidth,
        cutLength,
        areaSqm: round2(cutLength * wall.rollWidth),
      },
    ];
  }

  return wall.zones.map((zone) => {
    const cutLength = getCutLength(zone.length);
    return {
      wallId: wall.id,
      zoneId: zone.id,
      wallLabel: zone.label ? `${wall.label} — ${zone.label}` : wall.label,
      rollWidth: zone.rollWidth,
      cutLength,
      areaSqm: round2(cutLength * zone.rollWidth),
    };
  });
}

export function fabricPiecesFromWalls(walls: Wall[]): FabricPiece[] {
  return walls.flatMap(fabricPiecesFromWall);
}

import { MAX_ROLL_LENGTH } from '@/constants/limits';
import type { FabricPiece, PackedRoll } from '@/types/calculation';
import { round2 } from '@/lib/math';

/**
 * Жадная упаковка отрезов в рулоны 70 м (First-Fit Decreasing).
 * Отрезы группируются по ширине рулона.
 */
export function packRolls(pieces: FabricPiece[]): PackedRoll[] {
  const byWidth = new Map<number, FabricPiece[]>();

  for (const piece of pieces) {
    const list = byWidth.get(piece.rollWidth) ?? [];
    list.push(piece);
    byWidth.set(piece.rollWidth, list);
  }

  const packed: PackedRoll[] = [];

  for (const [rollWidth, group] of byWidth) {
    const sorted = [...group].sort((a, b) => b.cutLength - a.cutLength);
    const bins: { used: number; cuts: PackedRoll['cuts'] }[] = [];

    for (const piece of sorted) {
      let placed = false;
      for (const bin of bins) {
        if (bin.used + piece.cutLength <= MAX_ROLL_LENGTH + 1e-9) {
          bin.used = round2(bin.used + piece.cutLength);
          bin.cuts.push({ cutLength: piece.cutLength, wallLabel: piece.wallLabel });
          placed = true;
          break;
        }
      }
      if (!placed) {
        bins.push({
          used: piece.cutLength,
          cuts: [{ cutLength: piece.cutLength, wallLabel: piece.wallLabel }],
        });
      }
    }

    bins.forEach((bin, index) => {
      packed.push({
        rollWidth,
        rollIndex: index + 1,
        usedLength: round2(bin.used),
        leftoverLength: round2(MAX_ROLL_LENGTH - bin.used),
        cuts: bin.cuts,
      });
    });
  }

  return packed;
}

export function totalRollCount(packed: PackedRoll[]): number {
  return packed.length;
}

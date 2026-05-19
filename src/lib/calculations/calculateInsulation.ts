import { INSULATION_PRODUCTS, type InsulationType } from '@/constants/catalogs';
import { PRICES } from '@/constants/prices';
import type { Wall } from '@/types/wall';
import { ceilInt, round2 } from '@/lib/math';

export function totalWallArea(walls: Wall[]): number {
  return round2(walls.reduce((sum, w) => sum + w.lengthL * w.heightH, 0));
}

export interface InsulationResult {
  type: InsulationType;
  name: string;
  packs: number;
  packArea: number;
  unitPrice: number;
  total: number;
}

export function calculateInsulation(
  walls: Wall[],
  insulationType: InsulationType,
): InsulationResult | null {
  if (insulationType === 'none') {
    return null;
  }

  const product = INSULATION_PRODUCTS[insulationType];
  const totalArea = totalWallArea(walls);
  const packArea = round2(product.length * product.width);
  const packs = ceilInt(totalArea / packArea);
  const unitPrice = PRICES[product.priceKey];

  return {
    type: insulationType,
    name: product.name,
    packs,
    packArea,
    unitPrice,
    total: packs * unitPrice,
  };
}

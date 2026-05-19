import { INSERT_ID_BOX_METERS } from '@/constants/limits';
import { PRICES } from '@/constants/prices';
import { ceilInt } from '@/lib/math';

export function calculateInsertIdBoxes(totalProfileMeters: number): {
  boxes: number;
  purchasedMeters: number;
  leftoverMeters: number;
} {
  if (totalProfileMeters <= 0) {
    return { boxes: 0, purchasedMeters: 0, leftoverMeters: 0 };
  }
  const boxes = ceilInt(totalProfileMeters / INSERT_ID_BOX_METERS);
  const purchasedMeters = boxes * INSERT_ID_BOX_METERS;
  return {
    boxes,
    purchasedMeters,
    leftoverMeters: purchasedMeters - totalProfileMeters,
  };
}

export function insertIdUnitPrice(): number {
  return PRICES.insertID;
}

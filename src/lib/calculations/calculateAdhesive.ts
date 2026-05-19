import { GLUE_CAN_LITERS, GLUE_RATE, GLUE_SPRAY_ML } from '@/constants/limits';
import { PRICES } from '@/constants/prices';
import { ceilInt, round2 } from '@/lib/math';

export interface AdhesiveResult {
  litersNeeded: number;
  liquidCans: number;
  sprayCans: number;
  liquidTotal: number;
  sprayTotal: number;
}

export function calculateAdhesive(
  totalAreaSqm: number,
  includeLiquid: boolean,
  includeSpray: boolean,
): AdhesiveResult {
  const litersNeeded = round2(totalAreaSqm * GLUE_RATE);
  const mlNeeded = litersNeeded * 1000;

  const liquidCans = includeLiquid ? ceilInt(litersNeeded / GLUE_CAN_LITERS) : 0;
  const sprayCans = includeSpray ? ceilInt(mlNeeded / GLUE_SPRAY_ML) : 0;

  return {
    litersNeeded,
    liquidCans,
    sprayCans,
    liquidTotal: liquidCans * PRICES.adhesiveLiquidPer5L,
    sprayTotal: sprayCans * PRICES.adhesiveSprayPer650ml,
  };
}

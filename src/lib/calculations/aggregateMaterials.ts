import { MAX_ROLL_LENGTH } from '@/constants/limits';
import { PRICES } from '@/constants/prices';
import type { InsulationType } from '@/constants/catalogs';
import type { Wall, SocketPoint } from '@/types/wall';
import type { CalculationResult, MaterialLine, RemnantLine } from '@/types/calculation';
import { roundMoney, round2, sumBy } from '@/lib/math';
import { fabricPiecesFromWalls } from './calculateWallFabric';
import { packRolls } from './packRolls';
import { calculateProfiles, totalPurchasedProfileMeters } from './calculateProfiles';
import { totalWallArea, calculateInsulation } from './calculateInsulation';
import { calculateAdhesive } from './calculateAdhesive';
import { calculateInsertIdBoxes, insertIdUnitPrice } from './calculateInsertId';
import { calculateSockets } from './calculateSockets';

export interface CalculatorInput {
  walls: Wall[];
  socketPoints: SocketPoint[];
  woodenInsertCount: number;
  insulationType: InsulationType;
  includeLiquidGlue: boolean;
  includeSprayGlue: boolean;
}

export function runFullCalculation(input: CalculatorInput): CalculationResult {
  const materials: MaterialLine[] = [];
  const remnants: RemnantLine[] = [];
  let idCounter = 0;
  const nextId = () => `line-${++idCounter}`;

  const pieces = fabricPiecesFromWalls(input.walls);
  const packed = packRolls(pieces);
  const totalAreaSqm = totalWallArea(input.walls);

  // Полотно: рулоны по ширине
  const rollsByWidth = new Map<number, number>();
  for (const roll of packed) {
    rollsByWidth.set(roll.rollWidth, (rollsByWidth.get(roll.rollWidth) ?? 0) + 1);
  }

  for (const [width, count] of rollsByWidth) {
    const purchasedSqm = count * MAX_ROLL_LENGTH * width;
    const widthPieces = pieces.filter((p) => p.rollWidth === width);
    const usedSqm = round2(sumBy(widthPieces, (p) => p.areaSqm));
    const leftoverSqm = round2(purchasedSqm - usedSqm);

    materials.push({
      id: nextId(),
      name: `Бесшовное полотно MSD, ширина ${width} м`,
      sku: `MSD-${width}`,
      unit: 'м²',
      quantity: round2(usedSqm),
      unitPrice: PRICES.wallpaperPerSqm,
      total: roundMoney(usedSqm * PRICES.wallpaperPerSqm),
      note: `Рулонов: ${count} × ${MAX_ROLL_LENGTH} м`,
    });

    if (leftoverSqm > 0.001) {
      remnants.push({
        id: nextId(),
        name: `Остаток полотна MSD ${width} м`,
        unit: 'м²',
        leftoverQty: leftoverSqm,
        unitPrice: PRICES.wallpaperPerSqm,
        totalRub: roundMoney(leftoverSqm * PRICES.wallpaperPerSqm),
      });
    }
  }

  // Профили
  const profiles = calculateProfiles(input.walls);
  for (const profile of profiles) {
    materials.push({
      id: nextId(),
      name: profile.name,
      sku: profile.article,
      unit: 'шт',
      quantity: profile.lamellasCount,
      unitPrice: profile.unitPrice,
      total: roundMoney(profile.lamellasCount * profile.unitPrice),
      note: `Ламель 2 пог. м, закуплено ${profile.purchasedMeters} м`,
    });
  }

  // Вставка ID
  const totalProfileM = totalPurchasedProfileMeters(profiles);
  const insertId = calculateInsertIdBoxes(totalProfileM);
  if (insertId.boxes > 0) {
    const unitPrice = insertIdUnitPrice();
    materials.push({
      id: nextId(),
      name: 'Вставка ID (короб 100 м)',
      sku: 'ID-INSERT',
      unit: 'уп',
      quantity: insertId.boxes,
      unitPrice,
      total: roundMoney(insertId.boxes * unitPrice),
    });
    if (insertId.leftoverMeters > 0.001) {
      remnants.push({
        id: nextId(),
        name: 'Остаток вставки ID',
        unit: 'м',
        leftoverQty: round2(insertId.leftoverMeters),
        unitPrice: round2(unitPrice / 100),
        totalRub: roundMoney(insertId.leftoverMeters * (unitPrice / 100)),
      });
    }
  }

  // Остатки по рулонам (погонные метры)
  for (const roll of packed) {
    if (roll.leftoverLength > 0.001) {
      const pricePerM = PRICES.wallpaperPerSqm * roll.rollWidth;
      remnants.push({
        id: nextId(),
        name: `Остаток рулона ${roll.rollWidth} м (#${roll.rollIndex})`,
        unit: 'м',
        leftoverQty: roll.leftoverLength,
        unitPrice: round2(pricePerM),
        totalRub: roundMoney(roll.leftoverLength * pricePerM),
      });
    }
  }

  // Закладные
  for (const socket of calculateSockets(input.socketPoints)) {
    materials.push({
      id: nextId(),
      name: socket.name,
      unit: 'шт',
      quantity: socket.quantity,
      unitPrice: socket.unitPrice,
      total: socket.total,
    });
  }

  if (input.woodenInsertCount > 0) {
    materials.push({
      id: nextId(),
      name: 'Деревянные закладные 15 мм',
      unit: 'шт',
      quantity: input.woodenInsertCount,
      unitPrice: 0,
      total: 0,
      note: 'Цена по запросу',
    });
  }

  // Уплотнитель
  const insulation = calculateInsulation(input.walls, input.insulationType);
  if (insulation) {
    materials.push({
      id: nextId(),
      name: insulation.name,
      unit: 'уп',
      quantity: insulation.packs,
      unitPrice: insulation.unitPrice,
      total: insulation.total,
      note: `Площадь покрытия упаковки: ${insulation.packArea} м²`,
    });
  }

  // Клей
  const adhesive = calculateAdhesive(
    totalAreaSqm,
    input.includeLiquidGlue,
    input.includeSprayGlue,
  );
  if (adhesive.liquidCans > 0) {
    materials.push({
      id: nextId(),
      name: 'Жидкий клей TÖNLOS, канистра 5 л',
      unit: 'шт',
      quantity: adhesive.liquidCans,
      unitPrice: PRICES.adhesiveLiquidPer5L,
      total: adhesive.liquidTotal,
      note: `Потребность ~${adhesive.litersNeeded} л`,
    });
  }
  if (adhesive.sprayCans > 0) {
    materials.push({
      id: nextId(),
      name: 'Аэрозольный клей TÖNLOS, 650 мл',
      unit: 'шт',
      quantity: adhesive.sprayCans,
      unitPrice: PRICES.adhesiveSprayPer650ml,
      total: adhesive.sprayTotal,
    });
  }

  const grandTotalRub = roundMoney(sumBy(materials, (m) => m.total));
  const remnantsTotalRub = roundMoney(sumBy(remnants, (r) => r.totalRub));

  return {
    materials,
    remnants,
    remnantsTotalRub,
    grandTotalRub,
    totalAreaSqm,
  };
}

import { describe, expect, it } from 'vitest';
import { getCutLength, fabricPiecesFromWall } from '../calculateWallFabric';
import { packRolls } from '../packRolls';
import { calculateProfiles } from '../calculateProfiles';
import { calculateAdhesive } from '../calculateAdhesive';
import { createEmptyProfileMeters } from '@/constants/catalogs';
import type { Wall } from '@/types/wall';

function makeWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: 'w1',
    label: 'Стена 1',
    lengthL: 4,
    heightH: 2.7,
    drapingMode: 'single',
    rollWidth: 2.8,
    zones: [],
    profileMeters: createEmptyProfileMeters(),
    openingsBaseMeters: 0,
    ...overrides,
  };
}

describe('getCutLength', () => {
  it('добавляет технологический допуск 0.2 м', () => {
    expect(getCutLength(4)).toBe(4.2);
  });
});

describe('packRolls', () => {
  it('упаковывает отрезы в рулоны не длиннее 70 м', () => {
    const wall = makeWall({ lengthL: 30 });
    const pieces = fabricPiecesFromWall(wall);
    const packed = packRolls(pieces);
    expect(packed.length).toBeGreaterThanOrEqual(1);
    for (const roll of packed) {
      expect(roll.usedLength).toBeLessThanOrEqual(70);
    }
  });
});

describe('calculateProfiles', () => {
  it('округляет метраж до ламелей по 2 м', () => {
    const wall = makeWall({
      profileMeters: { ...createEmptyProfileMeters(), AP5994: 5 },
    });
    const result = calculateProfiles([wall]);
    const base = result.find((p) => p.sku === 'AP5994');
    expect(base?.lamellasCount).toBe(3);
    expect(base?.purchasedMeters).toBe(6);
  });
});

describe('calculateAdhesive', () => {
  it('считает канистры 5 л по расходу 0.07 л/м²', () => {
    const result = calculateAdhesive(100, true, false);
    expect(result.litersNeeded).toBe(7);
    expect(result.liquidCans).toBe(2);
  });
});

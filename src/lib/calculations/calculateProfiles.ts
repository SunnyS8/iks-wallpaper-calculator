import { PROFILE_LAMELLA_LENGTH } from '@/constants/limits';
import { PROFILES, type ProfileSku } from '@/constants/catalogs';
import { PRICES } from '@/constants/prices';
import type { Wall } from '@/types/wall';
import { ceilInt, round2 } from '@/lib/math';
import { totalSeparatorMeters } from './calculateSeparator';

export interface ProfileAggregate {
  sku: ProfileSku;
  article: string;
  name: string;
  inputMeters: number;
  lamellasCount: number;
  purchasedMeters: number;
  unitPrice: number;
}

function metersToLamellas(meters: number): { lamellasCount: number; purchasedMeters: number } {
  if (meters <= 0) {
    return { lamellasCount: 0, purchasedMeters: 0 };
  }
  const lamellasCount = ceilInt(meters / PROFILE_LAMELLA_LENGTH);
  return {
    lamellasCount,
    purchasedMeters: lamellasCount * PROFILE_LAMELLA_LENGTH,
  };
}

/**
 * Агрегация профилей по артикулам с учётом ручного ввода и проёмов (АП 5994).
 * Разделительный профиль при зонировании добавляется к АП 5999.
 */
export function calculateProfiles(walls: Wall[]): ProfileAggregate[] {
  const metersBySku: Record<ProfileSku, number> = {
    AP5994: 0,
    AP5995: 0,
    AP5996: 0,
    AP5997: 0,
    AP5998: 0,
    AP5999: 0,
  };

  for (const wall of walls) {
    for (const profile of PROFILES) {
      metersBySku[profile.sku] += wall.profileMeters[profile.sku] ?? 0;
    }
    metersBySku.AP5994 += wall.openingsBaseMeters ?? 0;
  }

  metersBySku.AP5999 = round2(metersBySku.AP5999 + totalSeparatorMeters(walls));

  return PROFILES.map((profile) => {
    const inputMeters = round2(metersBySku[profile.sku]);
    const { lamellasCount, purchasedMeters } = metersToLamellas(inputMeters);
    return {
      sku: profile.sku,
      article: profile.article,
      name: profile.name,
      inputMeters,
      lamellasCount,
      purchasedMeters,
      unitPrice: PRICES[profile.priceKey],
    };
  }).filter((p) => p.lamellasCount > 0);
}

export function totalPurchasedProfileMeters(aggregates: ProfileAggregate[]): number {
  return round2(aggregates.reduce((s, p) => s + p.purchasedMeters, 0));
}

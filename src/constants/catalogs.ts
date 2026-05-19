import { PRICES } from './prices';

export const ROLL_WIDTHS = [2.6, 2.7, 2.8, 3.2] as const;
export type RollWidth = (typeof ROLL_WIDTHS)[number];

export type ProfileSku =
  | 'AP5994'
  | 'AP5995'
  | 'AP5996'
  | 'AP5997'
  | 'AP5998'
  | 'AP5999';

export const PROFILES: {
  sku: ProfileSku;
  article: string;
  name: string;
  priceKey: keyof typeof PRICES;
}[] = [
  { sku: 'AP5994', article: 'АП 5994', name: 'Профиль ID базовый', priceKey: 'profileBase' },
  { sku: 'AP5995', article: 'АП 5995', name: 'Профиль ID внутренний угол', priceKey: 'profileInnerCorner' },
  { sku: 'AP5996', article: 'АП 5996', name: 'Профиль ID внешний угол', priceKey: 'profileOuterCorner' },
  { sku: 'AP5997', article: 'АП 5997', name: 'Плинтус ID теневой', priceKey: 'profileShadowBaseboard' },
  { sku: 'AP5998', article: 'АП 5998', name: 'Профиль ID стена-потолок', priceKey: 'profileWallCeiling' },
  { sku: 'AP5999', article: 'АП 5999', name: 'Профиль ID разделительный', priceKey: 'profileSeparator' },
];

export type InsulationType = 'none' | 'tonlosAcoustic' | 'tonlosHeavy' | 'fintek150';

export const INSULATION_PRODUCTS: Record<
  Exclude<InsulationType, 'none'>,
  { name: string; length: number; width: number; height: number; priceKey: keyof typeof PRICES }
> = {
  tonlosAcoustic: {
    name: 'TÖNLOS ACOUSTIC FELT',
    length: 8,
    width: 1,
    height: 0.014,
    priceKey: 'tonlosAcousticFelt',
  },
  tonlosHeavy: {
    name: 'TÖNLOS HEAVY FELT',
    length: 5,
    width: 0.75,
    height: 0.013,
    priceKey: 'tonlosHeavyFelt',
  },
  fintek150: {
    name: 'Fintek 150',
    length: 45,
    width: 1.5,
    height: 0.017,
    priceKey: 'fintek150',
  },
};

export const SOCKET_INSERT_TYPES = [
  { type: 1 as const, name: 'Закладная одинарная (тип 1)', priceKey: 'insertType1' as const },
  { type: 2 as const, name: 'Закладная боковая для групп (тип 2)', priceKey: 'insertType2' as const },
  { type: 3 as const, name: 'Закладная внутренняя для групп (тип 3)', priceKey: 'insertType3' as const },
];

export function createEmptyProfileMeters(): Record<ProfileSku, number> {
  return {
    AP5994: 0,
    AP5995: 0,
    AP5996: 0,
    AP5997: 0,
    AP5998: 0,
    AP5999: 0,
  };
}

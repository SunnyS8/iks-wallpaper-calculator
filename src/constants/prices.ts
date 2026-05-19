/** Mock-цены с НДС 22% */
export const PRICES = {
  wallpaperPerSqm: 1200,

  profileBase: 450,
  profileInnerCorner: 480,
  profileOuterCorner: 480,
  profileShadowBaseboard: 520,
  profileWallCeiling: 490,
  profileSeparator: 510,

  tonlosAcousticFelt: 1800,
  tonlosHeavyFelt: 2400,
  fintek150: 3500,

  insertID: 2200,

  insertType1: 85,
  insertType2: 120,
  insertType3: 140,

  adhesiveLiquidPer5L: 4500,
  adhesiveSprayPer650ml: 850,
} as const;

export type PriceKey = keyof typeof PRICES;

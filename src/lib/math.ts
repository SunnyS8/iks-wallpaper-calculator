/** Округление до 2 знаков после запятой */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Округление вверх до целого */
export function ceilInt(value: number): number {
  return Math.ceil(value - 1e-9);
}

/** Округление денег до копеек */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sumBy<T>(items: T[], fn: (item: T) => number): number {
  return items.reduce((acc, item) => acc + fn(item), 0);
}

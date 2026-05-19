import { SOCKET_INSERT_TYPES } from '@/constants/catalogs';
import { PRICES } from '@/constants/prices';
import type { SocketPoint } from '@/types/wall';

export interface SocketLine {
  type: 1 | 2 | 3;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function calculateSockets(points: SocketPoint[]): SocketLine[] {
  const byType = new Map<1 | 2 | 3, number>();

  for (const point of points) {
    if (point.count > 0) {
      byType.set(point.type, (byType.get(point.type) ?? 0) + point.count);
    }
  }

  return SOCKET_INSERT_TYPES.map((meta) => {
    const quantity = byType.get(meta.type) ?? 0;
    const unitPrice = PRICES[meta.priceKey];
    return {
      type: meta.type,
      name: meta.name,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };
  }).filter((line) => line.quantity > 0);
}

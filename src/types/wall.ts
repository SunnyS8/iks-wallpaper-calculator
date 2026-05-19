import type { ProfileSku, RollWidth } from '@/constants/catalogs';

export type DrapingMode = 'single' | 'zoned';

export interface Zone {
  id: string;
  label?: string;
  length: number;
  rollWidth: RollWidth;
}

export interface Wall {
  id: string;
  label: string;
  lengthL: number;
  heightH: number;
  drapingMode: DrapingMode;
  rollWidth: RollWidth;
  zones: Zone[];
  profileMeters: Record<ProfileSku, number>;
  openingsBaseMeters: number;
}

export type SocketInsertType = 1 | 2 | 3;

export interface SocketPoint {
  id: string;
  type: SocketInsertType;
  count: number;
}

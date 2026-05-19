export type MaterialUnit = 'м' | 'м²' | 'шт' | 'уп' | 'л';

export interface MaterialLine {
  id: string;
  name: string;
  sku?: string;
  unit: MaterialUnit;
  quantity: number;
  unitPrice: number;
  total: number;
  note?: string;
}

export interface RemnantLine {
  id: string;
  name: string;
  unit: MaterialUnit;
  leftoverQty: number;
  unitPrice: number;
  totalRub: number;
}

export interface FabricPiece {
  wallId: string;
  zoneId?: string;
  wallLabel: string;
  rollWidth: number;
  cutLength: number;
  areaSqm: number;
}

export interface PackedRoll {
  rollWidth: number;
  rollIndex: number;
  usedLength: number;
  leftoverLength: number;
  cuts: { cutLength: number; wallLabel: string }[];
}

export interface CalculationResult {
  materials: MaterialLine[];
  remnants: RemnantLine[];
  remnantsTotalRub: number;
  grandTotalRub: number;
  totalAreaSqm: number;
}

import { create } from 'zustand';
import { createEmptyProfileMeters, type InsulationType } from '@/constants/catalogs';
import type { Wall, SocketPoint } from '@/types/wall';
import type { CalculationResult } from '@/types/calculation';
import { runFullCalculation } from '@/lib/calculations/aggregateMaterials';

export type WizardStep = 1 | 2 | 3 | 4;

function createId(): string {
  return crypto.randomUUID();
}

export function createDefaultWall(index: number): Wall {
  return {
    id: createId(),
    label: `Стена ${index}`,
    lengthL: 4,
    heightH: 2.7,
    drapingMode: 'single',
    rollWidth: 2.8,
    zones: [
      { id: createId(), length: 2, rollWidth: 2.8, label: 'Зона 1' },
      { id: createId(), length: 2, rollWidth: 2.8, label: 'Зона 2' },
    ],
    profileMeters: createEmptyProfileMeters(),
    openingsBaseMeters: 0,
  };
}

function createDefaultSocket(): SocketPoint {
  return { id: createId(), type: 1, count: 0 };
}

interface CalculatorState {
  step: WizardStep;
  walls: Wall[];
  socketPoints: SocketPoint[];
  woodenInsertCount: number;
  insulationType: InsulationType;
  includeLiquidGlue: boolean;
  includeSprayGlue: boolean;
  result: CalculationResult | null;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setWalls: (walls: Wall[]) => void;
  addWall: () => void;
  removeWall: (id: string) => void;
  updateWall: (id: string, patch: Partial<Wall>) => void;
  setSocketPoints: (points: SocketPoint[]) => void;
  addSocketPoint: () => void;
  removeSocketPoint: (id: string) => void;
  setWoodenInsertCount: (n: number) => void;
  setInsulationType: (t: InsulationType) => void;
  setIncludeLiquidGlue: (v: boolean) => void;
  setIncludeSprayGlue: (v: boolean) => void;
  runCalculation: () => CalculationResult;
  reset: () => void;
}

const initialWalls = [createDefaultWall(1)];

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  step: 1,
  walls: initialWalls,
  socketPoints: [createDefaultSocket()],
  woodenInsertCount: 0,
  insulationType: 'none',
  includeLiquidGlue: true,
  includeSprayGlue: false,
  result: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(4, s.step + 1) as WizardStep })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) as WizardStep })),

  setWalls: (walls) => set({ walls }),
  addWall: () =>
    set((s) => ({
      walls: [...s.walls, createDefaultWall(s.walls.length + 1)],
    })),
  removeWall: (id) =>
    set((s) => ({
      walls: s.walls.length > 1 ? s.walls.filter((w) => w.id !== id) : s.walls,
    })),
  updateWall: (id, patch) =>
    set((s) => ({
      walls: s.walls.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),

  setSocketPoints: (socketPoints) => set({ socketPoints }),
  addSocketPoint: () =>
    set((s) => ({ socketPoints: [...s.socketPoints, createDefaultSocket()] })),
  removeSocketPoint: (id) =>
    set((s) => ({
      socketPoints:
        s.socketPoints.length > 1
          ? s.socketPoints.filter((p) => p.id !== id)
          : s.socketPoints,
    })),
  setWoodenInsertCount: (woodenInsertCount) => set({ woodenInsertCount }),
  setInsulationType: (insulationType) => set({ insulationType }),
  setIncludeLiquidGlue: (includeLiquidGlue) => set({ includeLiquidGlue }),
  setIncludeSprayGlue: (includeSprayGlue) => set({ includeSprayGlue }),

  runCalculation: () => {
    const state = get();
    const result = runFullCalculation({
      walls: state.walls,
      socketPoints: state.socketPoints,
      woodenInsertCount: state.woodenInsertCount,
      insulationType: state.insulationType,
      includeLiquidGlue: state.includeLiquidGlue,
      includeSprayGlue: state.includeSprayGlue,
    });
    set({ result });
    return result;
  },

  reset: () =>
    set({
      step: 1,
      walls: [createDefaultWall(1)],
      socketPoints: [createDefaultSocket()],
      woodenInsertCount: 0,
      insulationType: 'none',
      includeLiquidGlue: true,
      includeSprayGlue: false,
      result: null,
    }),
}));

import { useCallback } from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';

export function useCalculation() {
  const runCalculation = useCalculatorStore((s) => s.runCalculation);
  const result = useCalculatorStore((s) => s.result);

  const recalculate = useCallback(() => {
    return runCalculation();
  }, [runCalculation]);

  return { result, recalculate };
}

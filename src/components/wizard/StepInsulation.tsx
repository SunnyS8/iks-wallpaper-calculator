import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCalculatorStore } from '@/store/calculatorStore';
import { INSULATION_PRODUCTS } from '@/constants/catalogs';
import { insulationSchema, type InsulationFormValues } from '@/lib/validation/schemas';
import { Card, CardTitle } from '@/components/ui/Card';

export function StepInsulation() {
  const insulationType = useCalculatorStore((s) => s.insulationType);
  const includeLiquidGlue = useCalculatorStore((s) => s.includeLiquidGlue);
  const includeSprayGlue = useCalculatorStore((s) => s.includeSprayGlue);
  const setInsulationType = useCalculatorStore((s) => s.setInsulationType);
  const setIncludeLiquidGlue = useCalculatorStore((s) => s.setIncludeLiquidGlue);
  const setIncludeSprayGlue = useCalculatorStore((s) => s.setIncludeSprayGlue);

  const { register, watch } = useForm<InsulationFormValues>({
    resolver: zodResolver(insulationSchema),
    defaultValues: {
      insulationType,
      includeLiquidGlue,
      includeSprayGlue,
    },
    values: { insulationType, includeLiquidGlue, includeSprayGlue },
  });

  const watched = watch();

  useEffect(() => {
    setInsulationType(watched.insulationType);
    setIncludeLiquidGlue(watched.includeLiquidGlue);
    setIncludeSprayGlue(watched.includeSprayGlue);
  }, [watched, setInsulationType, setIncludeLiquidGlue, setIncludeSprayGlue]);

  return (
    <Card>
      <CardTitle>Шаг 4 — Звукоизоляция и клей</CardTitle>
      <p className="mt-2 text-sm text-slate-600">
        Расход жидкого клея: 0,07 л/м². Канистра 5 л, аэрозоль 650 мл.
      </p>

      <label className="mt-6 block max-w-md text-sm">
        <span className="font-medium text-slate-700">Звукоизоляционный уплотнитель</span>
        <select
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          {...register('insulationType')}
        >
          <option value="none">Без уплотнителя</option>
          <option value="tonlosAcoustic">
            {INSULATION_PRODUCTS.tonlosAcoustic.name} (8×1 м)
          </option>
          <option value="tonlosHeavy">
            {INSULATION_PRODUCTS.tonlosHeavy.name} (5×0,75 м)
          </option>
          <option value="fintek150">
            {INSULATION_PRODUCTS.fintek150.name} (45×1,5 м)
          </option>
        </select>
      </label>

      <fieldset className="mt-6 space-y-2">
        <legend className="text-sm font-medium text-slate-700">Клей TÖNLOS</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('includeLiquidGlue')} />
          Жидкий клей, канистра 5 л
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('includeSprayGlue')} />
          Аэрозольный клей, 650 мл
        </label>
      </fieldset>
    </Card>
  );
}

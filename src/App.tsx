import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { WizardProgress } from '@/components/layout/WizardProgress';
import { StepActions } from '@/components/layout/StepActions';
import { StepGeometry } from '@/components/wizard/StepGeometry';
import { StepMaterials } from '@/components/wizard/StepMaterials';
import { StepEngineering } from '@/components/wizard/StepEngineering';
import { StepInsulation } from '@/components/wizard/StepInsulation';
import { SpecificationTable } from '@/components/results/SpecificationTable';
import { RemnantsTable } from '@/components/results/RemnantsTable';
import { useCalculatorStore } from '@/store/calculatorStore';
import { validateGeometryStep, validateMaterialsStep } from '@/lib/validation/validateStep';

export default function App() {
  const step = useCalculatorStore((s) => s.step);
  const result = useCalculatorStore((s) => s.result);
  const walls = useCalculatorStore((s) => s.walls);
  const nextStep = useCalculatorStore((s) => s.nextStep);
  const prevStep = useCalculatorStore((s) => s.prevStep);
  const runCalculation = useCalculatorStore((s) => s.runCalculation);
  const reset = useCalculatorStore((s) => s.reset);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const err = validateGeometryStep(walls);
      if (err) {
        setError(err);
        return;
      }
    }
    if (step === 2) {
      const err = validateMaterialsStep(walls);
      if (err) {
        setError(err);
        return;
      }
    }
    if (step === 4) {
      runCalculation();
      return;
    }
    nextStep();
  };

  const handleReset = () => {
    reset();
    setError(null);
  };

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <WizardProgress current={step} />
        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {step === 1 && <StepGeometry />}
        {step === 2 && <StepMaterials />}
        {step === 3 && <StepEngineering />}
        {step === 4 && <StepInsulation />}

        <StepActions
          step={step}
          onBack={() => {
            setError(null);
            prevStep();
          }}
          onNext={handleNext}
          onRecalculate={() => {
            setError(null);
            runCalculation();
          }}
          onReset={handleReset}
        />

        {result && (
          <section className="mt-10 space-y-8 border-t border-slate-200 pt-8">
            <SpecificationTable
              materials={result.materials}
              grandTotal={result.grandTotalRub}
            />
            <RemnantsTable remnants={result.remnants} totalRub={result.remnantsTotalRub} />
            <p className="text-sm text-slate-500">
              Общая площадь стен: {result.totalAreaSqm.toFixed(2)} м²
            </p>
          </section>
        )}
      </main>
    </>
  );
}

import { Button } from '@/components/ui/Button';
import type { WizardStep } from '@/store/calculatorStore';

interface StepActionsProps {
  step: WizardStep;
  onBack: () => void;
  onNext: () => void;
  onRecalculate?: () => void;
  onReset: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

export function StepActions({
  step,
  onBack,
  onNext,
  onRecalculate,
  onReset,
  nextLabel,
  isNextDisabled,
}: StepActionsProps) {
  return (
    <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
      {step > 1 && (
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>
      )}
      <Button onClick={onNext} disabled={isNextDisabled}>
        {nextLabel ?? (step === 4 ? 'Рассчитать' : 'Далее')}
      </Button>
      {step === 4 && onRecalculate && (
        <Button variant="secondary" onClick={onRecalculate}>
          Пересчитать
        </Button>
      )}
      <Button variant="ghost" onClick={onReset} className="ml-auto">
        Сбросить
      </Button>
    </footer>
  );
}

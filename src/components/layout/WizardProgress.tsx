import clsx from 'clsx';
import type { WizardStep } from '@/store/calculatorStore';

const STEPS: { step: WizardStep; title: string }[] = [
  { step: 1, title: 'Геометрия' },
  { step: 2, title: 'Материалы' },
  { step: 3, title: 'Инженерия' },
  { step: 4, title: 'Изоляция и клей' },
];

interface WizardProgressProps {
  current: WizardStep;
}

export function WizardProgress({ current }: WizardProgressProps) {
  return (
    <nav aria-label="Шаги мастера" className="mb-6">
      <ol className="flex flex-col gap-2 sm:flex-row sm:gap-0">
        {STEPS.map(({ step, title }, index) => {
          const done = step < current;
          const active = step === current;
          return (
            <li
              key={step}
              className={clsx(
                'flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm',
                active && 'bg-brand-50 font-semibold text-brand-800',
                done && 'text-brand-700',
                !active && !done && 'text-slate-500',
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  active && 'bg-brand-700 text-white',
                  done && 'bg-brand-600 text-white',
                  !active && !done && 'bg-slate-200 text-slate-600',
                )}
              >
                {step}
              </span>
              <span className="hidden sm:inline">{title}</span>
              <span className="sm:hidden">{title}</span>
              {index < STEPS.length - 1 && (
                <span className="ml-auto hidden h-px flex-1 bg-slate-200 sm:block" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

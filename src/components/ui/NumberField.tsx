import clsx from 'clsx';
import { DIMENSION_STEP } from '@/constants/limits';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  hint?: string;
  error?: string;
  id?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  step = DIMENSION_STEP,
  min = 0,
  hint,
  error,
  id,
}: NumberFieldProps) {
  const fieldId = id ?? label.replace(/\s/g, '-');

  return (
    <>
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={fieldId}
        type="number"
        step={step}
        min={min}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={clsx(
          'mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20',
          error ? 'border-red-500' : 'border-slate-300',
        )}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}

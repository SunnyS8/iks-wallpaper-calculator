export function AppHeader() {
  return (
    <header className="mx-auto max-w-5xl border-b border-slate-200 bg-white px-4 py-6 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
        Экосистема ИКС
      </p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
        Калькулятор бесшовных обоев MSD
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Расчёт полотна, алюминиевых профилей, уплотнителей и клея для холодной натяжки. Цены
        указаны с НДС 22% (тестовый прайс).
      </p>
    </header>
  );
}

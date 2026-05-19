import { Plus } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { NumberField } from '@/components/ui/NumberField';
import { SocketPointRow } from '@/components/forms/SocketPointRow';

export function StepEngineering() {
  const socketPoints = useCalculatorStore((s) => s.socketPoints);
  const woodenInsertCount = useCalculatorStore((s) => s.woodenInsertCount);
  const setSocketPoints = useCalculatorStore((s) => s.setSocketPoints);
  const addSocketPoint = useCalculatorStore((s) => s.addSocketPoint);
  const removeSocketPoint = useCalculatorStore((s) => s.removeSocketPoint);
  const setWoodenInsertCount = useCalculatorStore((s) => s.setWoodenInsertCount);

  return (
    <Card>
      <CardTitle>Шаг 3 — Инженерные узлы</CardTitle>
      <p className="mt-2 text-sm text-slate-600">
        Укажите точки под розетки и выключатели с типом закладной. Деревянные закладные 15 мм — для
        ТВ, радиаторов, мебели.
      </p>

      <section className="mt-6 space-y-3">
        {socketPoints.map((point) => (
          <SocketPointRow
            key={point.id}
            point={point}
            canRemove={socketPoints.length > 1}
            onChange={(updated) =>
              setSocketPoints(
                socketPoints.map((p) => (p.id === point.id ? updated : p)),
              )
            }
            onRemove={() => removeSocketPoint(point.id)}
          />
        ))}
        <Button type="button" variant="secondary" onClick={addSocketPoint}>
          <Plus className="h-4 w-4" />
          Добавить группу точек
        </Button>
      </section>

      <section className="mt-6 max-w-xs">
        <NumberField
          label="Деревянные закладные 15 мм, шт"
          value={woodenInsertCount}
          onChange={setWoodenInsertCount}
          step={1}
          min={0}
          hint="Цена по запросу"
        />
      </section>
    </Card>
  );
}

import { Plus } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { WallCard } from '@/components/forms/WallCard';

export function StepGeometry() {
  const walls = useCalculatorStore((s) => s.walls);
  const addWall = useCalculatorStore((s) => s.addWall);
  const removeWall = useCalculatorStore((s) => s.removeWall);
  const updateWall = useCalculatorStore((s) => s.updateWall);

  return (
    <Card>
      <CardTitle>Шаг 1 — Геометрия стен</CardTitle>
      <p className="mt-2 text-sm text-slate-600">
        Укажите длину и высоту каждой стены. К длине отреза полотна автоматически добавляется
        0,2 м (по 0,1 м с каждой стороны).
      </p>
      <ul className="mt-6 space-y-4">
        {walls.map((wall) => (
          <li key={wall.id}>
            <WallCard
              wall={wall}
              canRemove={walls.length > 1}
              onChange={(w) => updateWall(wall.id, w)}
              onRemove={() => removeWall(wall.id)}
            />
          </li>
        ))}
      </ul>
      <Button type="button" variant="secondary" className="mt-4" onClick={addWall}>
        <Plus className="h-4 w-4" />
        Добавить стену
      </Button>
    </Card>
  );
}

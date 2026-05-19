import { useCalculatorStore } from '@/store/calculatorStore';
import { Card, CardTitle } from '@/components/ui/Card';
import { WallCard } from '@/components/forms/WallCard';

export function StepMaterials() {
  const walls = useCalculatorStore((s) => s.walls);
  const updateWall = useCalculatorStore((s) => s.updateWall);

  return (
    <Card>
      <CardTitle>Шаг 2 — Материалы и профили</CardTitle>
      <p className="mt-2 text-sm text-slate-600">
        Выберите ширину рулона или настройте зоны. Укажите метраж каждого типа профиля вручную.
      </p>
      <ul className="mt-6 space-y-4">
        {walls.map((wall) => (
          <li key={wall.id}>
            <WallCard
              wall={wall}
              canRemove={false}
              showProfiles
              onChange={(w) => updateWall(wall.id, w)}
              onRemove={() => undefined}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

import { z } from 'zod';
import { ROLL_WIDTHS } from '@/constants/catalogs';
import { DIMENSION_MIN, DIMENSION_STEP } from '@/constants/limits';

const dimension = z
  .number({ invalid_type_error: 'Введите число' })
  .min(DIMENSION_MIN, `Минимум ${DIMENSION_MIN} м`)
  .refine(
    (v) => Math.abs(Math.round(v / DIMENSION_STEP) * DIMENSION_STEP - v) < 1e-6,
    `Шаг ${DIMENSION_STEP} м`,
  );

export const zoneSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  length: dimension,
  rollWidth: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v) as (typeof ROLL_WIDTHS)[number]),
});

export const wallGeometrySchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Укажите название стены'),
  lengthL: dimension,
  heightH: dimension,
  drapingMode: z.enum(['single', 'zoned']),
});

export const wallMaterialsSchema = z
  .object({
    id: z.string(),
    drapingMode: z.enum(['single', 'zoned']),
    rollWidth: z.union([z.number(), z.string()]).optional(),
    heightH: dimension,
    zones: z.array(zoneSchema),
    profileMeters: z.record(z.string(), z.number().min(0)),
    openingsBaseMeters: z.number().min(0),
  })
  .superRefine((data, ctx) => {
    const rollWidth = Number(data.rollWidth);
    if (data.drapingMode === 'single') {
      if (!rollWidth || !ROLL_WIDTHS.includes(rollWidth as (typeof ROLL_WIDTHS)[number])) {
        ctx.addIssue({ code: 'custom', message: 'Выберите ширину рулона', path: ['rollWidth'] });
      }
      if (data.heightH > rollWidth + 1e-6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Высота стены не должна превышать ширину рулона',
          path: ['heightH'],
        });
      }
    } else {
      if (data.zones.length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Добавьте минимум 2 зоны',
          path: ['zones'],
        });
      }
      for (let i = 0; i < data.zones.length; i++) {
        const zone = data.zones[i];
        const rw = Number(zone.rollWidth);
        if (data.heightH > rw + 1e-6) {
          ctx.addIssue({
            code: 'custom',
            message: `Зона ${i + 1}: высота больше ширины рулона`,
            path: ['zones', i, 'rollWidth'],
          });
        }
      }
    }
  });

export const socketPointSchema = z.object({
  id: z.string(),
  type: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  count: z.number().int().min(0),
});

export const engineeringSchema = z.object({
  socketPoints: z.array(socketPointSchema),
  woodenInsertCount: z.number().int().min(0),
});

export const insulationSchema = z.object({
  insulationType: z.enum(['none', 'tonlosAcoustic', 'tonlosHeavy', 'fintek150']),
  includeLiquidGlue: z.boolean(),
  includeSprayGlue: z.boolean(),
});

export type InsulationFormValues = z.infer<typeof insulationSchema>;

import { z } from 'zod';

export const DashboardQuerySchema = z.object({
  period: z.enum(['today', 'week', 'month', 'year']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  { message: 'startDate deve ser anterior ou igual ao endDate' }
);

export type DashboardQueryDto = z.infer<typeof DashboardQuerySchema>;

export const DashboardQueryPipe = new (class {
  transform(value: DashboardQueryDto) {
    return DashboardQuerySchema.parse(value);
  }
})();

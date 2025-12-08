// schema/subjectSchema.ts
import { z } from 'zod';

export const subjectSeedSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().optional(),
  summary: z.string().optional(),
});

export const subjectBatchSchema = z.object({
  subjects: z.array(subjectSeedSchema).nonempty(),
});

export type SubjectSeed = z.infer<typeof subjectSeedSchema>;
export type SubjectBatch = z.infer<typeof subjectBatchSchema>;

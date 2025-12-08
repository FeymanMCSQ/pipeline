// schema/archetypeSchema.ts
import { z } from 'zod';

export const archetypeSeedSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  stream: z.string().optional(), // Stream enum, but treat as string in v0 pipeline
  order: z.number().int(),
  summary: z.string().optional(),
  eloMin: z.number().int().optional(),
  eloMax: z.number().int().optional(),
});

export const archetypeBatchSchema = z.object({
  archetypes: z.array(archetypeSeedSchema).nonempty(),
});

export type ArchetypeSeed = z.infer<typeof archetypeSeedSchema>;
export type ArchetypeBatch = z.infer<typeof archetypeBatchSchema>;

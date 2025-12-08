// schema/domainSchema.ts
import { z } from 'zod';

export const domainSeedSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().optional(),
  summary: z.string().optional(),
});

export const domainBatchSchema = z.object({
  domains: z.array(domainSeedSchema).nonempty(),
});

export type DomainSeed = z.infer<typeof domainSeedSchema>;
export type DomainBatch = z.infer<typeof domainBatchSchema>;

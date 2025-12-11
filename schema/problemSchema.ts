// /schema/problemSchema.ts
import { z } from 'zod';

// --- Shared bits ---

export const mcqChoiceSchema = z.object({
  id: z.enum(['A', 'B', 'C', 'D']),
  latex: z.string().min(1),
});

const baseProblemSchema = z.object({
  promptLatex: z.string().min(1),

  seedRating: z.number().int(),
  rating: z.number().int(),

  topic: z.string().min(1),
  tags: z.array(z.string().min(1)).nonempty(),

  solutions: z.string().min(1).optional(),
  requireForm: z.array(z.string().min(1)).optional(),
});

// --- MCQ ---

const mcqProblemSchema = baseProblemSchema.extend({
  // type can be omitted → treated as MCQ by the pipeline
  type: z.literal('MCQ').optional(),
  choices: z.array(mcqChoiceSchema).length(4),
  correctChoice: mcqChoiceSchema.shape.id,
  correctNumeric: z.never().optional(),
  correctExpr: z.never().optional(),
});

// --- NUMERIC ---

const numericPayloadSchema = z.object({
  value: z.string().min(1),
  toleranceAbs: z.number().positive().optional(),
  toleranceRel: z.number().positive().optional(),
});

const numericProblemSchema = baseProblemSchema.extend({
  type: z.literal('NUMERIC'),
  correctNumeric: numericPayloadSchema,
  correctExpr: z.never().optional(),
  choices: z.never().optional(),
  correctChoice: z.never().optional(),
});

// --- EXPRESSION ---

const expressionPayloadSchema = z.object({
  latex: z.string().min(1),
  domain: z.string().optional(),
});

const expressionProblemSchema = baseProblemSchema.extend({
  type: z.literal('EXPRESSION'),
  correctExpr: expressionPayloadSchema,
  correctNumeric: z.never().optional(),
  choices: z.never().optional(),
  correctChoice: z.never().optional(),
});

// --- Union + batch schema ---

export const generatedProblemSchema = z.union([
  mcqProblemSchema,
  numericProblemSchema,
  expressionProblemSchema,
]);

export const generatedProblemBatchSchema = z.object({
  problems: z.array(generatedProblemSchema).nonempty(),
});

// Useful TS types

export type GeneratedProblem = z.infer<typeof generatedProblemSchema>;
export type GeneratedProblemBatch = z.infer<typeof generatedProblemBatchSchema>;

// lib/validators/parseAndValidateAiBatch.ts

import { ZodError } from 'zod';
import {
  generatedProblemBatchSchema,
  type GeneratedProblemBatch,
} from '../../schema/problemSchema';

import { AiBatchError } from './errors';

export function parseAndValidateAiBatch(aiText: string): GeneratedProblemBatch {
  let parsed: unknown;

  // 1) JSON parse (retry-worthy)
  try {
    parsed = JSON.parse(aiText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
    throw new AiBatchError(
      'json_parse',
      `AI output was not valid JSON: ${msg}`
    );
  }

  // 2) Schema validation (not retry-worthy by default)
  const result = generatedProblemBatchSchema.safeParse(parsed);

  if (!result.success) {
    // IMPORTANT: throw ZodError so the route can return structured issues
    // (and your UI can show them cleanly).
    throw new ZodError(result.error.issues);
  }

  return result.data;
}

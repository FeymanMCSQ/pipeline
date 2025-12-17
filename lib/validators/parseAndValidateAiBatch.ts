// lib/validators/parseAndValidateAiBatch.ts

import { ZodError } from 'zod';
import {
  generatedProblemBatchSchema,
  type GeneratedProblemBatch,
} from '../../schema/problemSchema';

import { AiBatchError } from './errors';

export function parseAndValidateAiBatch(aiText: string): GeneratedProblemBatch {
  let parsed: unknown;

  // 1) Clean & JSON parse (retry-worthy)
  let clean = aiText.trim();
  // Remove markdown fences if present
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  clean = clean.replace(/\s*```$/, '');

  // Extract first { ... } block to ignore conversational pre/post-amble
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
    throw new AiBatchError(
      'json_parse',
      `AI output was not valid JSON: ${msg} (cleaned length: ${clean.length})`
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

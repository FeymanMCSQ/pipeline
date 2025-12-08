// generator/parser/parseGeneratorOutput.ts

import { ZodError } from 'zod';
import {
  generatedProblemBatchSchema,
  GeneratedProblemBatch,
} from '../../schema/problemSchema';

export type GeneratorParseErrorKind = 'json' | 'schema';

export class GeneratorParseError extends Error {
  kind: GeneratorParseErrorKind;
  issues?: ZodError['issues'];
  raw?: string;

  constructor(
    kind: GeneratorParseErrorKind,
    message: string,
    opts?: { issues?: ZodError['issues']; raw?: string }
  ) {
    super(message);
    this.name = 'GeneratorParseError';
    this.kind = kind;
    this.issues = opts?.issues;
    this.raw = opts?.raw;
  }
}

/**
 * Parse raw LLM output (string) into a strongly-typed batch of problems.
 *
 * Step 1: JSON.parse
 * Step 2: Zod schema validation (shape only, no math checks yet)
 *
 * On failure, throws GeneratorParseError with kind 'json' or 'schema'.
 */
export function parseGeneratorOutput(raw: string): GeneratedProblemBatch {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new GeneratorParseError('json', 'Invalid JSON from generator', {
      raw,
    });
  }

  const result = generatedProblemBatchSchema.safeParse(parsed);

  if (!result.success) {
    throw new GeneratorParseError(
      'schema',
      'Generator output failed schema validation',
      {
        issues: result.error.issues,
        raw,
      }
    );
  }

  return result.data;
}

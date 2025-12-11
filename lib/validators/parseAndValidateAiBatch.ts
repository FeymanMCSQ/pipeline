// /lib/validators/parseAndValidateAiBatch.ts

import {
  generatedProblemBatchSchema,
  type GeneratedProblemBatch,
} from '../../schema/problemSchema';

export function parseAndValidateAiBatch(aiText: string): GeneratedProblemBatch {
  let parsed: unknown;

  try {
    parsed = JSON.parse(aiText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown JSON parse error';
    throw new Error(`AI output was not valid JSON: ${msg}`);
  }

  const result = generatedProblemBatchSchema.safeParse(parsed);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    const pretty = issues
      .map((i) => `- [${i.path}] ${i.message} (${i.code})`)
      .join('\n');

    throw new Error(
      `AI output failed validation against generatedProblemBatchSchema:\n${pretty}`
    );
  }

  return result.data;
}

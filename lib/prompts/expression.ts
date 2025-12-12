// lib/prompts/expression.ts

import type { BuildPromptInput } from './types';
import { sharedHeader, sharedFooter } from './shared';

export function buildExpressionPrompt({
  archetypeId,
  band,
  count,
}: BuildPromptInput): string {
  return `
${sharedHeader()}

The JSON must have the shape:

{
  "problems": [
    {
      "type": "EXPRESSION",
      "promptLatex": string,
      "correctExpr": {
        "latex": string,
        "domain": string            // optional
      },
      "seedRating": number,         // integer
      "rating": number,             // integer
      "topic": string,
      "tags": string[],             // non-empty array
      "solutions": string,
      "requireForm": string[]       // optional
    }
  ]
}

Important constraints:

- "correctExpr.latex" MUST be a LaTeX string for the expected expression.
- "seedRating" and "rating" MUST be integers (e.g. between 200 and 300 for this band).
- "tags" MUST be a non-empty array of strings.
- "solutions" MUST be a single string, not an array.
- Do NOT include "choices", "correctChoice", "correctNumeric", or "openRubric".
- You may include extra fields like "archetypeId" or "band", but they are optional.

${sharedFooter({ archetypeId, band, count, typeLabel: 'EXPRESSION' })}
`.trim();
}

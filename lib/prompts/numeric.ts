// lib/prompts/numeric.ts

import type { BuildPromptInput } from './types';
import { sharedHeader, sharedFooter } from './shared';

export function buildNumericPrompt({
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
      "type": "NUMERIC",
      "promptLatex": string,
      "correctNumeric": {
        "value": string,
        "toleranceAbs": number,    // optional
        "toleranceRel": number     // optional
      },
      "seedRating": number,        // integer
      "rating": number,            // integer
      "topic": string,
      "tags": string[],            // non-empty array
      "solutions": string
    }
  ]
}

Important constraints:

- "correctNumeric.value" MUST be a string (e.g. "3", "-2", "0.25", "2*pi").
- "seedRating" and "rating" MUST be integers (e.g. between 200 and 300 for this band).
- "tags" MUST be a non-empty array of strings.
- "solutions" MUST be a single string, not an array.
- Do NOT include "choices", "correctChoice", "correctExpr", or "openRubric".
- You may include extra fields like "archetypeId" or "band", but they are optional.

${sharedFooter({ archetypeId, band, count, typeLabel: 'NUMERIC' })}
`.trim();
}

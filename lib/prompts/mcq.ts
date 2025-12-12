// lib/prompts/mcq.ts

import type { BuildPromptInput } from './types';
import { sharedHeader, sharedFooter } from './shared';

export function buildMcqPrompt({
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
      "type": "MCQ",               // optional, but if present must be exactly "MCQ"
      "promptLatex": string,
      "choices": [
        { "id": "A", "latex": string },
        { "id": "B", "latex": string },
        { "id": "C", "latex": string },
        { "id": "D", "latex": string }
      ],
      "correctChoice": "A" | "B" | "C" | "D",
      "seedRating": number,        // integer
      "rating": number,            // integer
      "topic": string,
      "tags": string[],            // non-empty array
      "solutions": string          // a single explanation string
    }
  ]
}

Important constraints:

- "choices" MUST be an array of exactly 4 objects with "id" one of "A","B","C","D".
- "correctChoice" MUST be one of "A","B","C","D".
- "seedRating" and "rating" MUST be integers (e.g. between 200 and 300 for this band).
- "tags" MUST be a non-empty array of strings.
- "solutions" MUST be a single string, not an array.
- Do NOT include "correctNumeric", "correctExpr", or "openRubric".
- You may include extra fields like "archetypeId" or "band", but they are optional.

${sharedFooter({ archetypeId, band, count, typeLabel: 'MCQ' })}
`.trim();
}

// lib/prompts/open.ts

import type { BuildPromptInput } from './types';
import { sharedHeader, sharedFooter } from './shared';

export function buildOpenPrompt({
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
      "type": "OPEN",
      "promptLatex": string,
      "openRubric": {
        "maxPoints": number,
        "criteria": [
          { "desc": string, "points": number }
        ],
        "keywordsMust": string[],     // optional
        "keywordsBonus": string[],    // optional
        "bannedPatterns": string[]    // optional
      },
      "seedRating": number,           // integer
      "rating": number,               // integer
      "topic": string,
      "tags": string[],               // non-empty array
      "solutions": string
    }
  ]
}

Important constraints:

- "openRubric.criteria" MUST be a non-empty array.
- Each criterion must have "desc" and integer "points".
- "seedRating" and "rating" MUST be integers (e.g. between 200 and 300 for this band).
- "tags" MUST be a non-empty array of strings.
- "solutions" MUST be a single string, not an array.
- Do NOT include "choices", "correctChoice", "correctNumeric", or "correctExpr".
- You may include extra fields like "archetypeId" or "band", but they are optional.

${sharedFooter({ archetypeId, band, count, typeLabel: 'OPEN' })}
`.trim();
}

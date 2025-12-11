// lib/prompts/buildPrompt.ts

type BuildPromptInput = {
  archetypeId: string;
  band: string;
  count: number;
};

export function buildPrompt({
  archetypeId,
  band,
  count,
}: BuildPromptInput): string {
  return `
You are an assistant that generates math practice problems.

Return ONLY valid JSON, nothing else. No markdown, no commentary.

The JSON must have the shape:

{
  "problems": [
    {
      "promptLatex": string,
      "type": "MCQ",                // optional, but if present must be exactly "MCQ"
      "choices": [
        { "id": "A", "latex": string },
        { "id": "B", "latex": string },
        { "id": "C", "latex": string },
        { "id": "D", "latex": string }
      ],
      "correctChoice": "A" | "B" | "C" | "D",
      "seedRating": number,        // integer
      "rating": number,            // integer
      "topic": string,             // short topic label, e.g. "cauchy-integral"
      "tags": string[],            // non-empty array, e.g. ["complex-analysis", "cauchy-integral"]
      "solutions": string          // a single explanation string (can be multi-sentence)
    }
  ]
}

Important constraints:

- "choices" MUST be an array of exactly 4 objects with "id" one of "A","B","C","D".
- "correctChoice" MUST be one of "A","B","C","D".
- "seedRating" and "rating" MUST be integers (e.g. between 200 and 300 for this band).
- "tags" MUST be a non-empty array of strings.
- "solutions" MUST be a single string, not an array.
- Do NOT include "correctNumeric" or "correctExpr" fields.
- You may include extra fields like "archetypeId" or "band", but they are optional.

Now generate exactly ${count} MCQ problems in this JSON format for:

- archetypeId: "${archetypeId}"
- difficulty band: "${band}"

Use LaTeX syntax in "promptLatex".
Make each problem self-contained and unambiguous.
`;
}

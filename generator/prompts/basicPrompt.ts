// generator/prompts/basicPrompt.ts

import { BAND_DESCRIPTIONS } from '../bandDescriptions';

export function buildBasicProblemPrompt({
  archetypeTitle,
  band,
  count,
}: {
  archetypeTitle: string;
  band: string;
  count: number;
}) {
  const bandInfo = BAND_DESCRIPTIONS[band] ?? 'No band description available.';

  return `
You are a STEM problem generator.

Archetype: "${archetypeTitle}"
Difficulty band: ${band}

Difficulty characteristics (derived from system rating framework):
${bandInfo}

Generate exactly ${count} problems.

Each problem must reflect the cognitive stage and difficulty constraints described above.

Return ONLY valid JSON in this format:

{
  "problems": [
    {
      "promptLatex": "...",
      "choices": [
        {"id": "A", "latex": "..."},
        {"id": "B", "latex": "..."},
        {"id": "C", "latex": "..."},
        {"id": "D", "latex": "..."}
      ],
      "correctChoice": "A"
    }
  ]
}

Rules:
- No commentary. No backticks. No markdown.
- Output must be valid JSON.
- Latex must be clean.
- Exactly four choices per problem.
- Exactly one correct choice.
- Avoid trick questions.
- Ensure alignment with the band description.
`;
}

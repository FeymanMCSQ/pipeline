// lib/prompts/buildPrompt.ts

export type BuildPromptArgs = {
  archetypeId: string;
  band: string;
  count: number;
};

// Minimal v1 prompt factory.
// Later we can swap archetypeId for real archetype metadata (slug, title, etc.).
export function buildPrompt({
  archetypeId,
  band,
  count,
}: BuildPromptArgs): string {
  return [
    'You are an assistant that generates math practice problems.',
    '',
    'Return ONLY valid JSON, nothing else.',
    '',
    'The JSON must have the shape:',
    '{ "problems": [',
    '  {',
    '    "promptLatex": string,',
    '    "type": "MCQ",',
    '    "choices": string[],',
    '    "correctChoice": number,',
    '    "rating": number,',
    '    "archetypeId": string,',
    '    "band": string,',
    '    "tags": string[],',
    '    "solutions": string[]',
    '  }',
    '] }',
    '',
    `Generate ${count} multiple-choice problems for:`,
    `- archetypeId: "${archetypeId}"`,
    `- difficulty band: "${band}"`,
    '',
    'Use LaTeX in "promptLatex".',
    'Make the problems self-contained and unambiguous.',
  ].join('\n');
}

// lib/prompts/shared.ts

export function sharedHeader(): string {
  return `
You are an assistant that generates math practice problems.

Return ONLY valid JSON, nothing else. No markdown, no commentary.
`.trim();
}

export function sharedFooter(args: {
  archetypeId: string;
  band: string;
  count: number;
  typeLabel: string;
}): string {
  const { archetypeId, band, count, typeLabel } = args;

  return `
Now generate exactly ${count} ${typeLabel} problems in this JSON format for:

- archetypeId: "${archetypeId}"
- difficulty band: "${band}"

Use LaTeX syntax in "promptLatex".
Make each problem self-contained and unambiguous.
`.trim();
}

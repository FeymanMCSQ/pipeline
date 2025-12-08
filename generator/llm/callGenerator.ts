// generator/llm/callGenerator.ts

export type GeneratedChoice = {
  id: string;
  latex: string;
};

export type GeneratedProblem = {
  promptLatex: string;
  choices: GeneratedChoice[];
  correctChoice: string;
};

export type GeneratorResponse = {
  problems: GeneratedProblem[];
};

/**
 * Mock LLM wrapper.
 *
 * In v1 it completely ignores the prompt content and just returns
 * a deterministic JSON structure. Later, this will call a real LLM.
 */
export async function callGenerator(
  prompt: string
): Promise<GeneratorResponse> {
  // Try to extract the requested count from the prompt:
  // looks for: "Generate exactly N problems."
  const match = prompt.match(/Generate exactly\s+(\d+)\s+problems?/i);
  const count = match ? Math.max(1, Number(match[1])) : 3;

  const problems: GeneratedProblem[] = [];

  for (let i = 1; i <= count; i++) {
    problems.push({
      promptLatex: `x^2 + ${i}`,
      choices: [
        { id: 'A', latex: `${i}` },
        { id: 'B', latex: `${i + 1}` },
        { id: 'C', latex: `${i + 2}` },
        { id: 'D', latex: `${i + 3}` },
      ],
      correctChoice: 'B',
    });
  }

  return { problems };
}

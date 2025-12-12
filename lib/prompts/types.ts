// lib/prompts/types.ts

export type ProblemType = 'MCQ' | 'NUMERIC' | 'EXPRESSION' | 'OPEN';

export type BuildPromptInput = {
  archetypeId: string;
  band: string;
  count: number;
  type: ProblemType;
};

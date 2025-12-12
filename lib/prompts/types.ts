// lib/prompts/types.ts

export type ProblemType = 'MCQ' | 'NUMERIC' | 'EXPRESSION' | 'OPEN';

export type BuildPromptInput = {
  archetypeId: string;
  band: string;
  count: number;
  type: ProblemType;
};

// This is what the builders will actually receive
export type ArchetypeContext = {
  archetype: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    eloMin: number | null;
    eloMax: number | null;
  };
  domain: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
  } | null;
  subject: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
  } | null;
};

export type BuildPromptInputWithContext = BuildPromptInput & {
  ctx: ArchetypeContext;
};

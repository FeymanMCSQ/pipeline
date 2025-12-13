// lib/utils/shuffleMcq.ts

type ChoiceId = 'A' | 'B' | 'C' | 'D';
type Choice = { id: ChoiceId; latex: string };

type McqProblem = {
  type?: 'MCQ'; // optional if your schema allows missing type
  choices: Choice[];
  correctChoice: ChoiceId;
};

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isChoiceId(x: unknown): x is ChoiceId {
  return x === 'A' || x === 'B' || x === 'C' || x === 'D';
}

function isMcqProblem(p: unknown): p is McqProblem {
  if (typeof p !== 'object' || p === null) return false;

  const obj = p as Record<string, unknown>;

  // type is optional in your schema, but if present must be MCQ
  if (obj.type !== undefined && obj.type !== 'MCQ') return false;

  if (!Array.isArray(obj.choices) || obj.choices.length !== 4) return false;
  if (!isChoiceId(obj.correctChoice)) return false;

  // validate choice entries minimally
  for (const ch of obj.choices) {
    if (typeof ch !== 'object' || ch === null) return false;
    const c = ch as Record<string, unknown>;
    if (!isChoiceId(c.id)) return false;
    if (typeof c.latex !== 'string') return false;
  }

  return true;
}

/**
 * Shuffles MCQ choice order and remaps correctChoice accordingly.
 * For non-MCQ shapes, returns input unchanged.
 */
export function shuffleMcqProblem<T>(p: T): T {
  if (!isMcqProblem(p)) return p;

  const choices = p.choices;
  const correct = choices.find((c) => c.id === p.correctChoice);
  if (!correct) return p;

  // Shuffle by latex (lightweight; assumes latex strings are unique among the 4)
  const shuffledLatex = shuffle(choices.map((c) => c.latex));

  const ids: ChoiceId[] = ['A', 'B', 'C', 'D'];
  const newChoices: Choice[] = ids.map((id, idx) => ({
    id,
    latex: shuffledLatex[idx],
  }));

  const newCorrectChoice =
    newChoices.find((c) => c.latex === correct.latex)?.id ?? 'A';

  const out: McqProblem = {
    ...p,
    choices: newChoices,
    correctChoice: newCorrectChoice,
    type: p.type ?? 'MCQ',
  };

  return out as unknown as T;
}

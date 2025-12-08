import { buildBasicProblemPrompt } from '../generator/prompts/basicPrompt';
import { callGenerator } from '../generator/llm/callGenerator';

describe('callGenerator mock LLM wrapper', () => {
  test('returns the requested number of problems', async () => {
    const prompt = buildBasicProblemPrompt({
      archetypeTitle: 'Basic Differentiation',
      band: '800_1000',
      count: 3,
    });

    const result = await callGenerator(prompt);

    expect(result).toBeDefined();
    expect(Array.isArray(result.problems)).toBe(true);
    expect(result.problems.length).toBe(3);
  });

  test('each problem has promptLatex, choices, and correctChoice', async () => {
    const prompt = buildBasicProblemPrompt({
      archetypeTitle: 'Contour Integrals',
      band: '1000_1200',
      count: 2,
    });

    const { problems } = await callGenerator(prompt);

    for (const p of problems) {
      expect(typeof p.promptLatex).toBe('string');
      expect(Array.isArray(p.choices)).toBe(true);
      expect(p.choices.length).toBe(4);

      for (const c of p.choices) {
        expect(typeof c.id).toBe('string');
        expect(typeof c.latex).toBe('string');
      }

      expect(typeof p.correctChoice).toBe('string');
      expect(['A', 'B', 'C', 'D']).toContain(p.correctChoice);
    }
  });
});

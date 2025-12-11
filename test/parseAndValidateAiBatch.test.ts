// test/parseAndValidateAiBatch.test.ts

import type { GeneratedProblemBatch } from '@/schema/problemSchema';
import { parseAndValidateAiBatch } from '../lib/validators/parseAndValidateAiBatch';

describe('parseAndValidateAiBatch', () => {
  // 1. Valid batch should pass
  test('accepts a valid MCQ batch', () => {
    const valid = {
      problems: [
        {
          promptLatex: '1+1 = \\\\; ?',
          choices: [
            { id: 'A', latex: '1' },
            { id: 'B', latex: '2' },
            { id: 'C', latex: '3' },
            { id: 'D', latex: '4' },
          ],
          correctChoice: 'B',
          seedRating: 200,
          rating: 200,
          topic: 'arithmetic',
          tags: ['basics'],
          solutions: '1+1=2.',
        },
      ],
    };

    const raw = JSON.stringify(valid);

    const parsed: GeneratedProblemBatch = parseAndValidateAiBatch(raw);

    expect(parsed.problems).toHaveLength(1);
    expect(parsed.problems[0].promptLatex).toBe('1+1 = \\\\; ?');
  });

  // 2. Invalid JSON
  test('rejects invalid JSON', () => {
    const raw = '{ not valid JSON ';

    expect(() => parseAndValidateAiBatch(raw)).toThrow(
      /AI output was not valid JSON/
    );
  });

  // 3. Missing required field
  test('rejects batch missing promptLatex', () => {
    const invalid = {
      problems: [
        {
          // missing promptLatex
          choices: [
            { id: 'A', latex: '1' },
            { id: 'B', latex: '2' },
            { id: 'C', latex: '3' },
            { id: 'D', latex: '4' },
          ],
          correctChoice: 'B',
          seedRating: 200,
          rating: 200,
          topic: 'arithmetic',
          tags: ['basics'],
        },
      ],
    };

    const raw = JSON.stringify(invalid);

    expect(() => parseAndValidateAiBatch(raw)).toThrow(/failed validation/i);
  });

  // 4. Wrong number of choices
  test('rejects MCQ with fewer than 4 choices', () => {
    const invalid = {
      problems: [
        {
          promptLatex: '1+1 = \\\\; ?',
          choices: [
            { id: 'A', latex: '1' },
            { id: 'B', latex: '2' },
          ], // only 2 choices; schema requires 4
          correctChoice: 'B',
          seedRating: 200,
          rating: 200,
          topic: 'arithmetic',
          tags: ['basics'],
        },
      ],
    };

    const raw = JSON.stringify(invalid);

    expect(() => parseAndValidateAiBatch(raw)).toThrow();
  });

  // 5. NUMERIC problem validation
  test('accepts valid NUMERIC problem', () => {
    const validNumeric = {
      problems: [
        {
          promptLatex: 'Solve x = 5',
          type: 'NUMERIC',
          correctNumeric: { value: '5' },
          seedRating: 200,
          rating: 200,
          topic: 'algebra',
          tags: ['simple'],
        },
      ],
    };

    const raw = JSON.stringify(validNumeric);

    const parsed = parseAndValidateAiBatch(raw);

    expect(parsed.problems).toHaveLength(1);
    expect(parsed.problems[0].type).toBe('NUMERIC');
  });

  // 6. Reject NUMERIC missing correctNumeric
  test('rejects NUMERIC missing correctNumeric payload', () => {
    const invalidNumeric = {
      problems: [
        {
          promptLatex: 'Solve x = 5',
          type: 'NUMERIC',
          seedRating: 200,
          rating: 200,
          topic: 'algebra',
          tags: ['simple'],
        },
      ],
    };

    const raw = JSON.stringify(invalidNumeric);

    expect(() => parseAndValidateAiBatch(raw)).toThrow();
  });

  // 7. Reject EXPRESSION missing correctExpr
  test('rejects EXPRESSION missing correctExpr', () => {
    const invalidExpr = {
      problems: [
        {
          promptLatex: 'Simplify x^2',
          type: 'EXPRESSION',
          seedRating: 200,
          rating: 200,
          topic: 'algebra',
          tags: ['expr'],
        },
      ],
    };

    const raw = JSON.stringify(invalidExpr);

    expect(() => parseAndValidateAiBatch(raw)).toThrow();
  });
});

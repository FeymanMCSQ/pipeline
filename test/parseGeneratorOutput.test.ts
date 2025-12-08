// test/parseGeneratorOutput.test.ts

import {
  parseGeneratorOutput,
  GeneratorParseError,
} from '../generator/parser/parseGeneratorOutput';

describe('parseGeneratorOutput', () => {
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

    const result = parseGeneratorOutput(raw);

    expect(result.problems).toHaveLength(1);
    expect(result.problems[0].promptLatex).toBe('1+1 = \\\\; ?');
  });

  test('rejects invalid JSON', () => {
    const raw = '{ this is not json ';

    expect(() => parseGeneratorOutput(raw)).toThrow(GeneratorParseError);

    try {
      parseGeneratorOutput(raw);
    } catch (err) {
      const e = err as GeneratorParseError;
      expect(e.kind).toBe('json');
    }
  });

  test('rejects wrong shape (missing promptLatex)', () => {
    const invalid = {
      problems: [
        {
          // promptLatex missing
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

    expect(() => parseGeneratorOutput(raw)).toThrow(GeneratorParseError);

    try {
      parseGeneratorOutput(raw);
    } catch (err) {
      const e = err as GeneratorParseError;
      expect(e.kind).toBe('schema');
      expect(e.issues && e.issues.length).toBeGreaterThan(0);
    }
  });

  test('rejects MCQ with wrong number of choices', () => {
    const invalid = {
      problems: [
        {
          promptLatex: '1+1 = \\\\; ?',
          choices: [
            { id: 'A', latex: '1' },
            { id: 'B', latex: '2' },
          ], // only 2 choices, should be 4
          correctChoice: 'B',
          seedRating: 200,
          rating: 200,
          topic: 'arithmetic',
          tags: ['basics'],
        },
      ],
    };

    const raw = JSON.stringify(invalid);

    expect(() => parseGeneratorOutput(raw)).toThrow(GeneratorParseError);
  });
});

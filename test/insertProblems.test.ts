// test/insertProblems.test.ts

import { PrismaClient } from '@prisma/client';
import type { GeneratedProblemBatch } from '../schema/problemSchema';
import { insertProblems } from '../lib/db/insertProblems';

const prisma = new PrismaClient();

describe('insertProblems', () => {
  test('inserts validated problems into the database', async () => {
    // Minimal valid MCQ problem that matches generatedProblemSchema
    const batch: GeneratedProblemBatch = {
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
          // MCQ type is optional in schema; default is MCQ
          // type: 'MCQ',
        },
      ],
    };

    // Count rows before
    const before = await prisma.problem.count();

    const result = await insertProblems(batch.problems);

    // Count rows after
    const after = await prisma.problem.count();

    expect(result.insertedCount).toBe(1);
    expect(after).toBe(before + 1);
  });
});

// lib/db/insertProblems.ts

import { PrismaClient, Prisma, ProblemType } from '@prisma/client';
import type { GeneratedProblem } from '../../schema/problemSchema';

const prisma = new PrismaClient();

// Map a GeneratedProblem (validated by Zod) into the shape your DB expects.
function toCreateInput(
  problem: GeneratedProblem,
  archetypeId?: string
): Prisma.ProblemCreateManyInput {
  const base: Prisma.ProblemCreateManyInput = {
    promptLatex: problem.promptLatex,
    seedRating: problem.seedRating,
    rating: problem.rating,
    topic: problem.topic,
    tags: problem.tags,
    solutions: problem.solutions, // string | undefined
    type: (problem.type as ProblemType | undefined) ?? ProblemType.MCQ,
    requireForm: problem.requireForm, // string[] | undefined
    archetypeId: archetypeId ?? undefined,
  };

  if (base.type === ProblemType.MCQ) {
    return {
      ...base,
      choices: problem.choices, // Json | undefined
      correctChoice: problem.correctChoice, // string | undefined
      correctNumeric: undefined,
      correctExpr: undefined,
    };
  }

  if (base.type === ProblemType.NUMERIC) {
    return {
      ...base,
      choices: undefined,
      correctChoice: undefined,
      correctNumeric: problem.correctNumeric,
      correctExpr: undefined,
    };
  }

  // EXPRESSION (and any future non-MCQ/NUMERIC types you wire up similarly)
  return {
    ...base,
    choices: undefined,
    correctChoice: undefined,
    correctNumeric: undefined,
    correctExpr: problem.correctExpr,
  };
}

export async function insertProblems(
  problems: GeneratedProblem[],
  archetypeId?: string
): Promise<{ insertedCount: number }> {
  if (problems.length === 0) {
    return { insertedCount: 0 };
  }

  const data = problems.map((p) => toCreateInput(p, archetypeId));

  const result = await prisma.problem.createMany({
    data,
    skipDuplicates: false,
  });

  return { insertedCount: result.count };
}

// Optional helper for tests / scripts
export async function insertProblemBatchFromValidatedBatch(batch: {
  problems: GeneratedProblem[];
  archetypeId?: string;
}): Promise<{ insertedCount: number }> {
  return insertProblems(batch.problems, batch.archetypeId);
}

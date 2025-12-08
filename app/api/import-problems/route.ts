// app/api/import-problems/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient, ProblemType } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import {
  generatedProblemBatchSchema,
  type GeneratedProblemBatch,
  type GeneratedProblem,
} from '../../../schema/problemSchema';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { archetypeId, rawJson } = body as {
      archetypeId?: string;
      rawJson?: string;
    };

    if (!archetypeId || typeof archetypeId !== 'string') {
      return NextResponse.json(
        { message: 'archetypeId is required' },
        { status: 400 }
      );
    }

    if (!rawJson || typeof rawJson !== 'string') {
      return NextResponse.json(
        { message: 'rawJson (string) is required' },
        { status: 400 }
      );
    }

    // 1) Parse user-provided JSON.
    //    Accept either:
    //    - [ { ... }, { ... } ]
    //    - { problems: [ { ... } ] }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return NextResponse.json(
        { message: 'Problems JSON is not valid JSON' },
        { status: 400 }
      );
    }

    let normalized: unknown;

    if (Array.isArray(parsed)) {
      normalized = { problems: parsed };
    } else {
      normalized = parsed;
    }

    // 2) Schema validation (shape only)
    const batch: GeneratedProblemBatch =
      generatedProblemBatchSchema.parse(normalized);

    // 3) Map to Prisma input
    const data: Prisma.ProblemCreateManyInput[] = batch.problems.map((p) =>
      mapProblemToPrismaInput(p, archetypeId)
    );

    // 4) Insert into DB
    const result = await prisma.problem.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: 'Problems inserted',
      inserted: result.count,
    });
  } catch (err: unknown) {
    console.error('Import error:', err);
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// --- Mapping helper ---
// We trust Zod to give us a correct shape; we just route fields into the Prisma model.

type AnyProblem = GeneratedProblem;

function mapProblemToPrismaInput(
  p: AnyProblem,
  archetypeId: string
): Prisma.ProblemCreateManyInput {
  const base: Prisma.ProblemCreateManyInput = {
    promptLatex: p.promptLatex,

    seedRating: p.seedRating,
    rating: p.rating,
    topic: p.topic,
    tags: p.tags,
    solutions: p.solutions,

    requireForm: p.requireForm,

    archetypeId,
  };

  const type: AnyProblem['type'] = p.type ?? 'MCQ';

  if (type === 'NUMERIC') {
    return {
      ...base,
      type: ProblemType.NUMERIC,
      correctNumeric: p.correctNumeric ?? undefined,
      correctExpr: undefined,
      choices: undefined,
      correctChoice: undefined,
    };
  }

  if (type === 'EXPRESSION') {
    return {
      ...base,
      type: ProblemType.EXPRESSION,
      correctExpr: p.correctExpr ?? undefined,
      correctNumeric: undefined,
      choices: undefined,
      correctChoice: undefined,
    };
  }

  // Default: MCQ
  return {
    ...base,
    type: ProblemType.MCQ,
    choices: p.choices ?? [],
    correctChoice: p.correctChoice ?? null,
    correctNumeric: undefined,
    correctExpr: undefined,
  };
}

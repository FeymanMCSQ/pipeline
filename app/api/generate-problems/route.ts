// app/api/generate-problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { buildPrompt } from '@/lib/prompts/buildPrompt';
import { callGenerator } from '@/lib/ai/generate';
import { parseAndValidateAiBatch } from '@/lib/validators/parseAndValidateAiBatch';
import { insertProblems } from '@/lib/db/insertProblems';
import type { GeneratedProblemBatch } from '@/schema/problemSchema';
import type { ProblemType } from '@/lib/prompts/types'; // ✅ add

const bodySchema = z.object({
  archetypeId: z.string().min(1),
  band: z.string().min(1),
  count: z.coerce.number().int().min(1).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { archetypeId, band, count } = bodySchema.parse(json);

    const type: ProblemType = 'MCQ'; // ✅ default for now

    console.log('[generate-problems] Input:', {
      archetypeId,
      band,
      count,
      type,
    });

    console.log('[generate-problems] Input:', {
      archetypeId,
      band,
      count,
      type,
    });

    const prompt = await buildPrompt({ archetypeId, band, count, type });
    console.log('\n[Prompt]\n', prompt, '\n[End prompt]\n');

    const aiText = await callGenerator(prompt);
    console.log('\n[AI Raw Output]\n', aiText, '\n[End AI Output]\n');

    let validatedBatch: GeneratedProblemBatch;
    try {
      validatedBatch = parseAndValidateAiBatch(aiText);
    } catch (validationErr) {
      console.error('[generate-problems] validation failed:', validationErr);
      return NextResponse.json(
        {
          ok: false,
          stage: 'validation',
          error:
            validationErr instanceof Error
              ? validationErr.message
              : 'Unknown validation error',
        },
        { status: 400 }
      );
    }

    console.log(
      `[Validation] ${validatedBatch.problems.length} problems validated`
    );

    const { insertedCount } = await insertProblems(
      validatedBatch.problems,
      archetypeId
    );
    console.log(`[DB] Inserted ${insertedCount} problems`);

    return NextResponse.json({
      ok: true,
      meta: {
        received: { archetypeId, band, count, type },
        validated: validatedBatch.problems.length,
        inserted: insertedCount,
      },
      problems: validatedBatch.problems,
    });
  } catch (err) {
    console.error('[generate-problems] Route error:', err);
    return NextResponse.json(
      {
        ok: false,
        stage: 'route',
        error:
          err instanceof Error
            ? err.message
            : 'Invalid request or internal error',
      },
      { status: 400 }
    );
  }
}

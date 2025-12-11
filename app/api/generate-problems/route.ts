// app/api/generate-problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { buildPrompt } from '@/lib/prompts/buildPrompt';
import { callGenerator } from '@/lib/ai/generate';
import { parseAndValidateAiBatch } from '@/lib/validators/parseAndValidateAiBatch';
import { insertProblems } from '@/lib/db/insertProblems';
import type { GeneratedProblemBatch } from '@/schema/problemSchema';

// ----------------------------
// 1. Input validation schema
// ----------------------------
const bodySchema = z.object({
  archetypeId: z.string().min(1),
  band: z.string().min(1),
  count: z.coerce.number().int().min(1).max(50),
});

// ----------------------------
// 2. Route handler
// ----------------------------
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { archetypeId, band, count } = bodySchema.parse(json);

    console.log('[generate-problems] Input:', { archetypeId, band, count });

    // 3. Build prompt
    const prompt = buildPrompt({ archetypeId, band, count });
    console.log('\n[Prompt]\n', prompt, '\n[End prompt]\n');

    // 4. Call the generator model
    const aiText = await callGenerator(prompt);
    console.log('\n[AI Raw Output]\n', aiText, '\n[End AI Output]\n');

    // 5. JSON.parse + Zod validation (no repair step)
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

    // 6. Insert into DB, force-link to the archetype from the request
    const { insertedCount } = await insertProblems(
      validatedBatch.problems,
      archetypeId
    );

    console.log(`[DB] Inserted ${insertedCount} problems`);

    // 7. Return success
    return NextResponse.json({
      ok: true,
      meta: {
        received: { archetypeId, band, count },
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

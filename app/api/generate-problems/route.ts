// // app/api/generate-problems/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';

// import { buildPrompt } from '@/lib/prompts/buildPrompt';
// import { callGenerator } from '@/lib/ai/generate';
// import { parseAndValidateAiBatch } from '@/lib/validators/parseAndValidateAiBatch';
// import { insertProblems } from '@/lib/db/insertProblems';
// import type { GeneratedProblemBatch } from '@/schema/problemSchema';
// import type { ProblemType } from '@/lib/prompts/types'; // ✅ add

// const bodySchema = z.object({
//   archetypeId: z.string().min(1),
//   band: z.string().min(1),
//   count: z.coerce.number().int().min(1).max(50),
// });

// export async function POST(req: NextRequest) {
//   try {
//     const json = await req.json();
//     const { archetypeId, band, count } = bodySchema.parse(json);

//     const type: ProblemType = 'MCQ'; // ✅ default for now

//     console.log('[generate-problems] Input:', {
//       archetypeId,
//       band,
//       count,
//       type,
//     });

//     console.log('[generate-problems] Input:', {
//       archetypeId,
//       band,
//       count,
//       type,
//     });

//     const prompt = await buildPrompt({ archetypeId, band, count, type });
//     console.log('\n[Prompt]\n', prompt, '\n[End prompt]\n');

//     const aiText = await callGenerator(prompt);
//     console.log('\n[AI Raw Output]\n', aiText, '\n[End AI Output]\n');

//     let validatedBatch: GeneratedProblemBatch;
//     try {
//       validatedBatch = parseAndValidateAiBatch(aiText);
//     } catch (validationErr) {
//       console.error('[generate-problems] validation failed:', validationErr);
//       return NextResponse.json(
//         {
//           ok: false,
//           stage: 'validation',
//           error:
//             validationErr instanceof Error
//               ? validationErr.message
//               : 'Unknown validation error',
//         },
//         { status: 400 }
//       );
//     }

//     console.log(
//       `[Validation] ${validatedBatch.problems.length} problems validated`
//     );

//     const { insertedCount } = await insertProblems(
//       validatedBatch.problems,
//       archetypeId
//     );
//     console.log(`[DB] Inserted ${insertedCount} problems`);

//     return NextResponse.json({
//       ok: true,
//       meta: {
//         received: { archetypeId, band, count, type },
//         validated: validatedBatch.problems.length,
//         inserted: insertedCount,
//       },
//       problems: validatedBatch.problems,
//     });
//   } catch (err) {
//     console.error('[generate-problems] Route error:', err);
//     return NextResponse.json(
//       {
//         ok: false,
//         stage: 'route',
//         error:
//           err instanceof Error
//             ? err.message
//             : 'Invalid request or internal error',
//       },
//       { status: 400 }
//     );
//   }
// }
// app/api/generate-problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { buildPrompt } from '@/lib/prompts/buildPrompt';
import { callGenerator } from '@/lib/ai/generate';
import { parseAndValidateAiBatch } from '@/lib/validators/parseAndValidateAiBatch';
import { AiBatchError } from '@/lib/validators/errors';
import { insertProblems } from '@/lib/db/insertProblems';
import type { GeneratedProblemBatch } from '@/schema/problemSchema';
import type { ProblemType } from '@/lib/prompts/types';
import { shuffleMcqProblem } from '@/lib/utils/shuffleMcq';

const bodySchema = z.object({
  archetypeId: z.string().min(1),
  band: z.string().min(1),
  count: z.coerce.number().int().min(1).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { archetypeId, band, count } = bodySchema.parse(json);

    const type: ProblemType = 'MCQ'; // default for now

    console.log('[generate-problems] Input:', {
      archetypeId,
      band,
      count,
      type,
    });

    // 1) Build prompt (async; pulls archetype/domain/subject context)
    let prompt: string;
    try {
      prompt = await buildPrompt({ archetypeId, band, count, type });
    } catch (e) {
      console.error('[generate-problems] buildPrompt failed:', e);
      return NextResponse.json(
        {
          ok: false,
          stage: 'context',
          error: e instanceof Error ? e.message : 'Failed to build prompt',
        },
        { status: 404 }
      );
    }

    console.log('\n[Prompt]\n', prompt, '\n[End prompt]\n');

    // 2) Call generator (maybe twice if first output isn't valid JSON)
    let attempts = 1;
    let aiText = await callGenerator(prompt);
    console.log('\n[AI Raw Output #1]\n', aiText, '\n[End AI Output #1]\n');

    // 3) Parse + validate (retry once ONLY if JSON parse fails)
    let validatedBatch: GeneratedProblemBatch;

    try {
      validatedBatch = parseAndValidateAiBatch(aiText);
    } catch (err) {
      // Retry once if the output isn't valid JSON
      const shouldRetry =
        err instanceof AiBatchError && err.stage === 'json_parse';

      if (shouldRetry) {
        attempts = 2;
        console.warn(
          '[generate-problems] Invalid JSON from AI; retrying once…'
        );

        const repairPrompt = [
          prompt,
          '',
          'IMPORTANT: Your previous response was NOT valid JSON.',
          'Return ONLY valid JSON of the required shape: {"problems":[...]}',
          'No extra text, no markdown, no code fences.',
        ].join('\n');

        aiText = await callGenerator(repairPrompt);
        console.log('\n[AI Raw Output #2]\n', aiText, '\n[End AI Output #2]\n');

        try {
          validatedBatch = parseAndValidateAiBatch(aiText);
        } catch (validationErr2) {
          console.error(
            '[generate-problems] validation failed after retry:',
            validationErr2
          );

          if (validationErr2 instanceof ZodError) {
            return NextResponse.json(
              {
                ok: false,
                stage: 'validation',
                error: 'Zod validation failed',
                issues: validationErr2.issues.map((i) => ({
                  path: i.path.join('.'),
                  message: i.message,
                  code: i.code,
                })),
              },
              { status: 400 }
            );
          }

          return NextResponse.json(
            {
              ok: false,
              stage: 'validation',
              error:
                validationErr2 instanceof Error
                  ? validationErr2.message
                  : 'Unknown validation error',
            },
            { status: 400 }
          );
        }
      } else {
        // No retry; handle validation error normally
        console.error('[generate-problems] validation failed:', err);

        if (err instanceof ZodError) {
          return NextResponse.json(
            {
              ok: false,
              stage: 'validation',
              error: 'Zod validation failed',
              issues: err.issues.map((i) => ({
                path: i.path.join('.'),
                message: i.message,
                code: i.code,
              })),
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            ok: false,
            stage: 'validation',
            error:
              err instanceof Error ? err.message : 'Unknown validation error',
          },
          { status: 400 }
        );
      }
    }

    console.log(
      `[Validation] ${validatedBatch.problems.length} problems validated`
    );

    // 4) Insert
    const { insertedCount } = await insertProblems(
      validatedBatch.problems,
      archetypeId
    );
    console.log(`[DB] Inserted ${insertedCount} problems`);

    return NextResponse.json({
      ok: true,
      meta: {
        received: { archetypeId, band, count, type },
        attempts,
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

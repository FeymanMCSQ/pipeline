// // app/api/import-subjects/route.ts
// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import {
//   subjectBatchSchema,
//   type SubjectBatch,
//   type SubjectSeed,
// } from '../../../schema/subjectSchema';

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => null);

//     if (!body || typeof body !== 'object') {
//       return NextResponse.json(
//         { message: 'Invalid JSON body' },
//         { status: 400 }
//       );
//     }

//     const { rawJson } = body as { rawJson?: string };

//     if (!rawJson || typeof rawJson !== 'string') {
//       return NextResponse.json(
//         { message: 'rawJson (string) is required' },
//         { status: 400 }
//       );
//     }

//     // Parse user JSON: either [ {...} ] or { subjects: [ {...} ] }
//     let parsed: unknown;
//     try {
//       parsed = JSON.parse(rawJson);
//     } catch {
//       return NextResponse.json(
//         { message: 'Subjects JSON is not valid JSON' },
//         { status: 400 }
//       );
//     }

//     let normalized: unknown;
//     if (Array.isArray(parsed)) {
//       normalized = { subjects: parsed };
//     } else {
//       normalized = parsed;
//     }

//     const batch: SubjectBatch = subjectBatchSchema.parse(normalized);

//     let subjectsInserted = 0;
//     let subjectsUpdated = 0;

//     for (const s of batch.subjects) {
//       const { created } = await upsertSubject(s);
//       if (created) {
//         subjectsInserted += 1;
//       } else {
//         subjectsUpdated += 1;
//       }
//     }

//     return NextResponse.json({
//       message: 'Subjects upserted',
//       subjectsInserted,
//       subjectsUpdated,
//     });
//   } catch (err: unknown) {
//     console.error('Import subjects error:', err);
//     const message = err instanceof Error ? err.message : 'Unexpected error';
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }

// async function upsertSubject(
//   s: SubjectSeed
// ): Promise<{ id: string; created: boolean }> {
//   const existing = await prisma.subject.findUnique({
//     where: { slug: s.slug },
//     select: { id: true },
//   });

//   const subject = await prisma.subject.upsert({
//     where: { slug: s.slug },
//     update: {
//       title: s.title,
//       summary: s.summary,
//       order: s.order ?? 1,
//     },
//     create: {
//       slug: s.slug,
//       title: s.title,
//       summary: s.summary,
//       order: s.order ?? 1,
//     },
//     select: { id: true },
//   });

//   return { id: subject.id, created: !existing };
// }
// app/api/import-subjects/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  subjectBatchSchema,
  type SubjectBatch,
} from '../../../schema/subjectSchema';

const prisma = new PrismaClient();

function log(step: string, data?: unknown) {
  console.log(`\n[import-subjects] ${step}`);
  if (data !== undefined) {
    console.dir(data, { depth: 10 });
  }
}

export async function POST(req: Request) {
  log('REQUEST RECEIVED');

  try {
    // ─────────────────────────────────────────────
    // 1. Read raw body
    // ─────────────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
      log('Parsed request body', body);
    } catch (err) {
      log('❌ Failed to parse request JSON', err);
      return NextResponse.json(
        { error: 'Request body is not valid JSON' },
        { status: 400 }
      );
    }

    if (typeof body !== 'object' || body === null) {
      log('❌ Body is not an object', body);
      return NextResponse.json(
        { error: 'Body must be a JSON object' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // 2. Extract rawJson (NO any)
    // ─────────────────────────────────────────────
    const rawJson =
      'rawJson' in body &&
      typeof (body as Record<string, unknown>).rawJson === 'string'
        ? (body as Record<string, unknown>).rawJson
        : undefined;

    if (typeof rawJson !== 'string') {
      log('❌ rawJson missing or not a string', body);
      return NextResponse.json(
        {
          error: 'rawJson is required and must be a STRING containing JSON',
          hint: 'Send { "rawJson": "[{...}]" } — not the array directly',
        },
        { status: 400 }
      );
    }

    log('rawJson received (string)', rawJson);

    // ─────────────────────────────────────────────
    // 3. Parse rawJson string
    // ─────────────────────────────────────────────
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawJson);
      log('Parsed rawJson successfully', parsedJson);
    } catch (err) {
      log('❌ rawJson is not valid JSON', err);
      return NextResponse.json(
        { error: 'rawJson string is not valid JSON' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // 4. Normalize shape
    // ─────────────────────────────────────────────
    const normalized: unknown = Array.isArray(parsedJson)
      ? { subjects: parsedJson }
      : parsedJson;

    log(
      Array.isArray(parsedJson)
        ? 'Normalized array → { subjects: [...] }'
        : 'Using object form directly',
      normalized
    );

    // ─────────────────────────────────────────────
    // 5. Zod validation
    // ─────────────────────────────────────────────
    let batch: SubjectBatch;
    try {
      batch = subjectBatchSchema.parse(normalized);
      log('Zod validation PASSED', batch);
    } catch (err) {
      log('❌ Zod validation FAILED', err);
      return NextResponse.json(
        {
          error: 'Subject schema validation failed',
          details:
            err instanceof Error ? err.message : 'Unknown validation error',
        },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────
    // 6. Upsert subjects
    // ─────────────────────────────────────────────
    let inserted = 0;
    let updated = 0;

    for (const subject of batch.subjects) {
      log('Upserting subject', subject);

      const existing = await prisma.subject.findUnique({
        where: { slug: subject.slug },
        select: { id: true },
      });

      await prisma.subject.upsert({
        where: { slug: subject.slug },
        update: {
          title: subject.title,
          summary: subject.summary,
          order: subject.order ?? 1,
        },
        create: {
          slug: subject.slug,
          title: subject.title,
          summary: subject.summary,
          order: subject.order ?? 1,
        },
      });

      existing ? updated++ : inserted++;
    }

    log('✅ Import complete', { inserted, updated });

    return NextResponse.json({
      success: true,
      inserted,
      updated,
    });
  } catch (err) {
    log('🔥 UNHANDLED ERROR', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

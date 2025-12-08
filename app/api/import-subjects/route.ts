// app/api/import-subjects/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  subjectBatchSchema,
  type SubjectBatch,
  type SubjectSeed,
} from '../../../schema/subjectSchema';

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

    const { rawJson } = body as { rawJson?: string };

    if (!rawJson || typeof rawJson !== 'string') {
      return NextResponse.json(
        { message: 'rawJson (string) is required' },
        { status: 400 }
      );
    }

    // Parse user JSON: either [ {...} ] or { subjects: [ {...} ] }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return NextResponse.json(
        { message: 'Subjects JSON is not valid JSON' },
        { status: 400 }
      );
    }

    let normalized: unknown;
    if (Array.isArray(parsed)) {
      normalized = { subjects: parsed };
    } else {
      normalized = parsed;
    }

    const batch: SubjectBatch = subjectBatchSchema.parse(normalized);

    let subjectsInserted = 0;
    let subjectsUpdated = 0;

    for (const s of batch.subjects) {
      const { created } = await upsertSubject(s);
      if (created) {
        subjectsInserted += 1;
      } else {
        subjectsUpdated += 1;
      }
    }

    return NextResponse.json({
      message: 'Subjects upserted',
      subjectsInserted,
      subjectsUpdated,
    });
  } catch (err: unknown) {
    console.error('Import subjects error:', err);
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function upsertSubject(
  s: SubjectSeed
): Promise<{ id: string; created: boolean }> {
  const existing = await prisma.subject.findUnique({
    where: { slug: s.slug },
    select: { id: true },
  });

  const subject = await prisma.subject.upsert({
    where: { slug: s.slug },
    update: {
      title: s.title,
      summary: s.summary,
      order: s.order ?? 1,
    },
    create: {
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      order: s.order ?? 1,
    },
    select: { id: true },
  });

  return { id: subject.id, created: !existing };
}

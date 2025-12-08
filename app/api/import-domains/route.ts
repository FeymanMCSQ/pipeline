// app/api/import-domains/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  domainBatchSchema,
  type DomainBatch,
  type DomainSeed,
} from '../../../schema/domainSchema';

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

    const { subjectId, rawJson } = body as {
      subjectId?: string;
      rawJson?: string;
    };

    if (!subjectId || typeof subjectId !== 'string') {
      return NextResponse.json(
        { message: 'subjectId is required' },
        { status: 400 }
      );
    }

    if (!rawJson || typeof rawJson !== 'string') {
      return NextResponse.json(
        { message: 'rawJson (string) is required' },
        { status: 400 }
      );
    }

    // Make sure subject exists (hard fail if not)
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { id: true, slug: true },
    });

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found for given subjectId' },
        { status: 404 }
      );
    }

    // Parse user JSON: either [ {...} ] or { domains: [ {...} ] }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return NextResponse.json(
        { message: 'Domains JSON is not valid JSON' },
        { status: 400 }
      );
    }

    let normalized: unknown;
    if (Array.isArray(parsed)) {
      normalized = { domains: parsed };
    } else {
      normalized = parsed;
    }

    const batch: DomainBatch = domainBatchSchema.parse(normalized);

    let domainsUpserted = 0;

    for (const d of batch.domains) {
      await upsertDomainForSubject(d, subjectId);
      domainsUpserted += 1;
    }

    return NextResponse.json({
      message: 'Domains upserted',
      subjectId,
      subjectSlug: subject.slug,
      domainsUpserted,
    });
  } catch (err: unknown) {
    console.error('Import domains error:', err);
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function upsertDomainForSubject(d: DomainSeed, subjectId: string) {
  await prisma.domain.upsert({
    where: { slug: d.slug },
    update: {
      title: d.title,
      summary: d.summary,
      order: d.order ?? 1,
      subjectId,
    },
    create: {
      slug: d.slug,
      title: d.title,
      summary: d.summary,
      order: d.order ?? 1,
      subjectId,
    },
  });
}

// app/api/import-archetypes/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient, Stream } from '@prisma/client';
import {
  archetypeBatchSchema,
  type ArchetypeBatch,
  type ArchetypeSeed,
} from '../../../schema/archetypeSchema';

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

    const { domainId, rawJson } = body as {
      domainId?: string;
      rawJson?: string;
    };

    if (!domainId || typeof domainId !== 'string') {
      return NextResponse.json(
        { message: 'domainId is required' },
        { status: 400 }
      );
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      select: { id: true, slug: true },
    });

    if (!domain) {
      return NextResponse.json(
        { message: 'Domain not found for given domainId' },
        { status: 404 }
      );
    }

    if (!rawJson || typeof rawJson !== 'string') {
      return NextResponse.json(
        { message: 'rawJson (string) is required' },
        { status: 400 }
      );
    }

    // Parse either array or { archetypes: [...] }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return NextResponse.json(
        { message: 'Archetypes JSON is not valid JSON' },
        { status: 400 }
      );
    }

    const normalized = Array.isArray(parsed) ? { archetypes: parsed } : parsed;

    const batch: ArchetypeBatch = archetypeBatchSchema.parse(normalized);

    let upsertedCount = 0;

    for (const a of batch.archetypes) {
      await upsertArchetype(a, domainId);
      upsertedCount += 1;
    }

    return NextResponse.json({
      message: 'Archetypes upserted',
      domainId,
      domainSlug: domain.slug,
      upsertedCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function upsertArchetype(a: ArchetypeSeed, domainId: string) {
  // Convert stream string → Prisma enum if present
  const streamValue = a.stream ? (a.stream as Stream) : null;

  await prisma.archetype.upsert({
    where: { slug: a.slug },
    update: {
      title: a.title,
      summary: a.summary,
      stream: streamValue ?? undefined,
      order: a.order,
      eloMin: a.eloMin ?? 200,
      eloMax: a.eloMax ?? 1900,
      domainId,
    },
    create: {
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      stream: streamValue ?? undefined,
      order: a.order,
      eloMin: a.eloMin ?? 200,
      eloMax: a.eloMax ?? 1900,
      domainId,
    },
  });
}

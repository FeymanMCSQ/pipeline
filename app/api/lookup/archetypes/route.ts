import { NextResponse } from 'next/server';
import { PrismaClient, Stream } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') ?? '').trim();
    const streamParam = (url.searchParams.get('stream') ?? '').trim();

    const where: Prisma.ArchetypeWhereInput = {};

    if (q) {
      where.OR = [
        { slug: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (streamParam) {
      if (streamParam === 'VC' || streamParam === 'CA') {
        where.stream = streamParam as Stream;
      }
    }

    const archetypes = await prisma.archetype.findMany({
      where,
      include: {
        domain: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
      orderBy: [{ stream: 'asc' }, { order: 'asc' }, { slug: 'asc' }],
      take: 50,
    });

    const payload = archetypes.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      stream: a.stream,
      order: a.order,
      domainSlug: a.domain?.slug ?? null,
      domainTitle: a.domain?.title ?? null,
    }));

    return NextResponse.json({ archetypes: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

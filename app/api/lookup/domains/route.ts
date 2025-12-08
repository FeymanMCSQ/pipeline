import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') ?? '').trim();

    const where: Prisma.DomainWhereInput = {};

    if (q) {
      where.OR = [
        { slug: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
      ];
    }

    const domains = await prisma.domain.findMany({
      where,
      include: {
        subject: {
          select: { id: true, slug: true, title: true },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
      take: 50,
    });

    const payload = domains.map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      order: d.order,
      summary: d.summary,
      subjectId: d.subjectId,
      subjectSlug: d.subject?.slug ?? null,
      subjectTitle: d.subject?.title ?? null,
    }));

    return NextResponse.json({ domains: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

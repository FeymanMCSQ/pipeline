import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') ?? '').trim();

    const where: Prisma.SubjectWhereInput = {};

    if (q) {
      where.OR = [
        { slug: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
      take: 50,
    });

    const payload = subjects.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      order: s.order,
      summary: s.summary,
    }));

    return NextResponse.json({ subjects: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

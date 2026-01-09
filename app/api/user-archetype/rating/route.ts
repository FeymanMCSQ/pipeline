import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Body = {
  userId?: string;
  archetypeId?: string;
  rating?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { userId, archetypeId, rating } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { message: 'userId (string) is required' },
        { status: 400 }
      );
    }

    if (!archetypeId || typeof archetypeId !== 'string') {
      return NextResponse.json(
        { message: 'archetypeId (string) is required' },
        { status: 400 }
      );
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { message: 'rating (number) is required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || !Number.isFinite(rating)) {
      return NextResponse.json(
        { message: 'rating must be a finite number' },
        { status: 400 }
      );
    }

    const ratingInt = Math.round(rating);

    // First fetch to get previous rating (for logging)
    const existing = await prisma.userArchetype.findUnique({
      where: {
        userId_archetypeId: {
          userId,
          archetypeId,
        },
      },
      select: {
        id: true,
        rating: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message:
            'UserArchetype record not found for given userId and archetypeId',
        },
        { status: 404 }
      );
    }

    const updated = await prisma.userArchetype.update({
      where: {
        userId_archetypeId: {
          userId,
          archetypeId,
        },
      },
      data: {
        rating: ratingInt,
      },
    });

    // Optional: log a rating event for auditability
    try {
      await prisma.ratingEvent.create({
        data: {
          userId,
          problemId: null,
          before: existing.rating,
          after: updated.rating,
          delta: updated.rating - existing.rating,
          reason: 'manual_user_archetype_rating_override',
        },
      });
    } catch (e) {
      // Non-fatal – log but don't fail the main response
      console.error('Failed to create RatingEvent for userArchetype update', e);
    }

    return NextResponse.json({
      message: 'UserArchetype rating updated',
      userArchetypeId: existing.id,
      userId,
      archetypeId,
      oldRating: existing.rating,
      newRating: updated.rating,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

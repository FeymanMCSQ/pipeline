import type {
  BuildPromptInput,
  BuildPromptInputWithContext,
  ArchetypeContext,
} from './types';
import { buildMcqPrompt } from './mcq';
import { buildNumericPrompt } from './numeric';
import { buildExpressionPrompt } from './expression';
import { buildOpenPrompt } from './open';

import { prisma } from '../prisma'; // adjust to your prisma client path

async function loadArchetypeContext(
  archetypeId: string
): Promise<ArchetypeContext> {
  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      eloMin: true,
      eloMax: true,
      domain: {
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          subject: {
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
            },
          },
        },
      },
    },
  });

  if (!archetype) {
    throw new Error(`buildPrompt: Archetype not found (id=${archetypeId})`);
  }

  return {
    archetype: {
      id: archetype.id,
      slug: archetype.slug,
      title: archetype.title,
      summary: archetype.summary ?? null,
      eloMin: archetype.eloMin ?? null,
      eloMax: archetype.eloMax ?? null,
    },
    domain: archetype.domain
      ? {
          id: archetype.domain.id,
          slug: archetype.domain.slug,
          title: archetype.domain.title,
          summary: archetype.domain.summary ?? null,
        }
      : null,
    subject: archetype.domain?.subject
      ? {
          id: archetype.domain.subject.id,
          slug: archetype.domain.subject.slug,
          title: archetype.domain.subject.title,
          summary: archetype.domain.subject.summary ?? null,
        }
      : null,
  };
}

export async function buildPrompt(input: BuildPromptInput): Promise<string> {
  const ctx = await loadArchetypeContext(input.archetypeId);

  const enriched: BuildPromptInputWithContext = {
    ...input,
    ctx,
  };

  switch (enriched.type) {
    case 'MCQ':
      return buildMcqPrompt(enriched);
    case 'NUMERIC':
      return buildNumericPrompt(enriched);
    case 'EXPRESSION':
      return buildExpressionPrompt(enriched);
    case 'OPEN':
      return buildOpenPrompt(enriched);
    default: {
      const _never: never = enriched.type;
      return _never;
    }
  }
}

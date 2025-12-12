// lib/prompts/shared.ts
import type { ArchetypeContext } from './types';
import { BAND_DESCRIPTIONS } from '../../generator/bandDescriptions';

export function sharedHeader(): string {
  return [
    'JSON ONLY. No prose, no markdown, no code fences.',
    'Output: {"problems":[...]}',
  ].join('\n');
}

export function topicBlock(args: {
  ctx: ArchetypeContext;
  band: string;
  count: number;
  typeLabel: string;
}): string {
  const { ctx, band, count, typeLabel } = args;

  const subject = ctx.subject ? `${ctx.subject.title}` : 'Unknown';
  const domain = ctx.domain ? `${ctx.domain.title}` : 'Unknown';
  const arch = `${ctx.archetype.title}`;
  const slug = ctx.archetype.slug;
  const sum = (ctx.archetype.summary ?? '').trim();

  const bandInfo = BAND_DESCRIPTIONS[band] ?? 'No band description available.';
  
  return [
    `Generate exactly ${count} ${typeLabel} problems.`,
    `TOPIC STRICT: Subject=${subject}; Domain=${domain}; Archetype=${arch}; slug=${slug}.`,
    sum ? `Summary: ${sum}` : '',
    `Difficulty band=${band}. seedRating & rating must be integers near band.`,
    'Difficulty characteristics (derived from system rating framework):',
    bandInfo,
    'Each problem must reflect the cognitive stage and difficulty constraints described above.',
    'No generic/basic arithmetic unless this archetype is arithmetic.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function commonFields(): string {
  return [
    'Common fields per problem:',
    '- promptLatex (LaTeX string)',
    '- seedRating (int), rating (int)',
    '- topic (string)',
    '- tags (non-empty string[])',
    '- solutions (single string)',
  ].join('\n');
}

export function endLine(): string {
  return 'Return {"problems":[...]} only.';
}

// lib/prompts/open.ts
import type { BuildPromptInputWithContext } from './types';
import { sharedHeader, topicBlock, commonFields, endLine } from './shared';

export function buildOpenPrompt(input: BuildPromptInputWithContext): string {
  const { band, count, ctx } = input;

  return [
    sharedHeader(),
    topicBlock({ ctx, band, count, typeLabel: 'OPEN' }),
    commonFields(),
    'OPEN fields:',
    '- openRubric: { maxPoints:number, criteria:[{desc:string, points:int}], keywordsMust?:string[], keywordsBonus?:string[], bannedPatterns?:string[] }',
    '- criteria must be non-empty',
    'Do NOT include: choices, correctChoice, correctNumeric, correctExpr.',
    endLine(),
  ].join('\n');
}

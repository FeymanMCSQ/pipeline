// lib/prompts/numeric.ts
import type { BuildPromptInputWithContext } from './types';
import { sharedHeader, topicBlock, commonFields, endLine } from './shared';

export function buildNumericPrompt(input: BuildPromptInputWithContext): string {
  const { band, count, ctx } = input;

  return [
    sharedHeader(),
    topicBlock({ ctx, band, count, typeLabel: 'NUMERIC' }),
    commonFields(),
    'NUMERIC fields:',
    '- correctNumeric: { value: string, toleranceAbs?: number, toleranceRel?: number }',
    'Do NOT include: choices, correctChoice, correctExpr, openRubric.',
    endLine(),
  ].join('\n');
}

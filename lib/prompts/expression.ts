// lib/prompts/expression.ts
import type { BuildPromptInputWithContext } from './types';
import { sharedHeader, topicBlock, commonFields, endLine } from './shared';

export function buildExpressionPrompt(
  input: BuildPromptInputWithContext
): string {
  const { band, count, ctx } = input;

  return [
    sharedHeader(),
    topicBlock({ ctx, band, count, typeLabel: 'EXPRESSION' }),
    commonFields(),
    'EXPRESSION fields:',
    '- correctExpr: { latex: string, domain?: string }',
    '- requireForm?: string[]',
    'Do NOT include: choices, correctChoice, correctNumeric, openRubric.',
    endLine(),
  ].join('\n');
}

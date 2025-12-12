// lib/prompts/mcq.ts
import type { BuildPromptInputWithContext } from './types';
import { sharedHeader, topicBlock, commonFields, endLine } from './shared';

export function buildMcqPrompt(input: BuildPromptInputWithContext): string {
  const { band, count, ctx } = input;

  return [
    sharedHeader(),
    topicBlock({ ctx, band, count, typeLabel: 'MCQ' }),
    commonFields(),
    'MCQ fields:',
    '- choices: exactly 4 items: {id:"A"|"B"|"C"|"D", latex:string}',
    '- correctChoice: "A"|"B"|"C"|"D"',
    'Do NOT include: correctNumeric, correctExpr, openRubric.',
    endLine(),
  ].join('\n');
}

// lib/prompts/buildPrompt.ts

import type { BuildPromptInput } from './types';
import { buildMcqPrompt } from './mcq';
import { buildNumericPrompt } from './numeric';
import { buildExpressionPrompt } from './expression';
import { buildOpenPrompt } from './open';

export function buildPrompt(input: BuildPromptInput): string {
  switch (input.type) {
    case 'MCQ':
      return buildMcqPrompt(input);
    case 'NUMERIC':
      return buildNumericPrompt(input);
    case 'EXPRESSION':
      return buildExpressionPrompt(input);
    case 'OPEN':
      return buildOpenPrompt(input);
    default: {
      // exhaustive check
      const _never: never = input.type;
      return _never;
    }
  }
}

// app/api/generate-problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildPrompt } from '@/lib/prompts/buildPrompt';
import { callGenerator } from '@/lib/ai/generate';

// Basic input validation
const bodySchema = z.object({
  archetypeId: z.string().min(1, 'archetypeId is required'),
  band: z.string().min(1, 'band is required'),
  // allow string or number, coerce to number
  count: z.coerce.number().int().min(1).max(50).default(5),
});

// Mock problem type
type MockProblem = {
  promptLatex: string;
  type: 'MCQ';
  choices: string[];
  correctChoice: number;
  rating: number;
  archetypeId: string;
  band: string;
  tags: string[];
  solutions: string[];
};

// fake problems for now
function makeMockProblems(
  archetypeId: string,
  band: string,
  count: number
): MockProblem[] {
  const problems: MockProblem[] = [];

  for (let i = 0; i < count; i++) {
    problems.push({
      promptLatex: `\\text{Mock problem ${
        i + 1
      } for archetype ${archetypeId} in band ${band}}`,
      type: 'MCQ',
      choices: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctChoice: 0,
      rating: 250,
      archetypeId,
      band,
      tags: ['mock', 'dev'],
      solutions: [
        'This is a mock solution. In v1.1 this will be AI-generated.',
      ],
    });
  }

  return problems;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { archetypeId, band, count } = bodySchema.parse(json);

    console.log('[generate-problems] called with:', {
      archetypeId,
      band,
      count,
    });

    // Build the minimal prompt
    const prompt = buildPrompt({ archetypeId, band, count });
    console.log('\n[generate-problems] generated prompt:\n');
    console.log(prompt);
    console.log('\n--- end prompt ---\n');

    // 🔹 NEW: call OpenRouter via callGenerator
    let aiText: string | null = null;
    try {
      aiText = await callGenerator(prompt);
      console.log('\n[generate-problems] raw AI response:\n');
      console.log(aiText);
      console.log('\n--- end AI response ---\n');
    } catch (aiErr) {
      console.error('[generate-problems] AI call failed:', aiErr);
      // For now we just fall back to mock problems regardless
    }

    // Still using mock problems in the response for now
    const problems = makeMockProblems(archetypeId, band, count);

    return NextResponse.json({
      ok: true,
      meta: {
        archetypeId,
        band,
        requestedCount: count,
        generatedCount: problems.length,
        // small preview so you can see AI output from the client if you want
        aiPreview: aiText ? aiText.slice(0, 200) : null,
      },
      problems,
      // full raw AI output included separately (can remove later if you want)
      aiText,
    });
  } catch (err) {
    console.error('[generate-problems] error:', err);

    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid request or internal error',
        details:
          err instanceof Error ? err.message : 'Unknown error in generator',
      },
      { status: 400 }
    );
  }
}

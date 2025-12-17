// lib/ai/generate.ts

// This runs on the server only.
// Make sure you set OPENROUTER_API_KEY in your env.

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Optional: keep model configurable via env
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'x-ai/grok-4.1-fast';

if (!process.env.OPENROUTER_API_KEY) {
  console.warn(
    '[callGenerator] OPENROUTER_API_KEY is not set. Calls will fail at runtime.'
  );
}

// Type describing the minimal parts of the OpenRouter response we use
interface OpenRouterChatCompletion {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
    text?: string | null;
  }>;
}

export async function callGenerator(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      '[callGenerator] Missing OPENROUTER_API_KEY. Set it in your env.'
    );
  }

  const body = {
    model: DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant that strictly follows instructions and responds concisely.You are a backend data generator.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  };

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:3000', // or your production URL
      'X-Title': 'Feynman Pipeline',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '<no body>');
    throw new Error(
      `[callGenerator] OpenRouter error: ${res.status} ${res.statusText} — ${text}`
    );
  }

  const data: OpenRouterChatCompletion = await res.json();

  const content =
    data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text ?? '';

  if (!content || typeof content !== 'string') {
    throw new Error(
      '[callGenerator] No content returned from OpenRouter response.'
    );
  }

  return content;
}

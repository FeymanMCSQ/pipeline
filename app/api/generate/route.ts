import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { archetypeId, band, count } = await req.json();

  console.log('Generate called with:');
  console.log({ archetypeId, band, count });

  return NextResponse.json({
    ok: true,
    received: { archetypeId, band, count },
  });
}

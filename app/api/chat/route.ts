import type { NextRequest } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  const res = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.MODEL ?? 'gpt-oss-20b',
      messages,
      stream: true,
    }),
  });

  if (!res.body) {
    return new Response('No stream', { status: 500 });
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

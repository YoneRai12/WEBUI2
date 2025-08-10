'use client';

import { FC, FormEvent, useEffect, useRef, useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const HomePage: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [streaming, setStreaming] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!res.body) {
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    setMessages((msgs) => [...msgs, { role: 'assistant', content: '' }]);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      const lines = chunkValue.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.replace(/^data:\s*/, '');
        if (data === '[DONE]') {
          setStreaming(false);
          return;
        }
        try {
          const json = JSON.parse(data);
          const text: string = json.choices?.[0]?.delta?.content ?? '';
          if (text) {
            setMessages((msgs) => {
              const updated = [...msgs];
              updated[updated.length - 1].content += text;
              return updated;
            });
          }
        } catch {
          // ignore malformed JSON
        }
      }
    }
    setStreaming(false);
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded px-3 py-2 text-sm md:max-w-md ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {m.content}
              {streaming && idx === messages.length - 1 && m.role === 'assistant'
                ? '…'
                : ''}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-white p-4"
      >
        <input
          type="text"
          className="flex-1 rounded border px-3 py-2"
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={streaming}
        >
          送信
        </button>
      </form>
    </main>
  );
};

export default HomePage;

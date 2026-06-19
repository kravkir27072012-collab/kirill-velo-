import { ChatMessage } from '../types';

// MVP-only: calls Anthropic directly from the client. EXPO_PUBLIC_* vars are
// bundled into the app and extractable, so before shipping move this call
// behind a backend proxy (e.g. a Supabase Edge Function) that holds the key.
const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-5';

const SYSTEM_PROMPT =
  'Ты — дружелюбный эксперт по обслуживанию и ремонту велосипедов. ' +
  'Объясняй простыми словами, как новичку, который ничего не понимает в устройстве велосипеда. ' +
  'Давай чёткие пошаговые инструкции, называй нужные инструменты и запчасти. ' +
  'Если вопрос не про велосипеды — мягко верни разговор к теме велосипедов.';

function mockReply(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes('скрип') && text.includes('цеп')) {
    return (
      'Скрип цепи почти всегда означает сухость или загрязнение:\n\n' +
      '1. Протрите цепь сухой тряпкой, чтобы убрать грязь и старую смазку.\n' +
      '2. Нанесите велосипедную смазку для цепи на каждое звено, покручивая педали назад.\n' +
      '3. Подождите 5–10 минут, затем протрите излишки смазки тряпкой.\n' +
      '4. Если скрип не ушёл — проверьте натяжение цепи и состояние звёздочек на износ.\n\n' +
      '(Это демо-ответ. Подключите ANTHROPIC_API_KEY, чтобы получать реальные ответы от ИИ.)'
    );
  }
  if (text.includes('тормоз')) {
    return (
      'Если тормоза скрипят или плохо держат:\n\n' +
      '1. Проверьте, не загрязнены ли колодки и обод/диск — протрите спиртовой салфеткой.\n' +
      '2. Убедитесь, что колодки касаются обода/диска равномерно, без перекоса.\n' +
      '3. При сильном износе (менее 1 мм толщины) — замените колодки.\n\n' +
      '(Это демо-ответ. Подключите ANTHROPIC_API_KEY для реальных ответов ИИ.)'
    );
  }
  return (
    'Я могу подсказать по обслуживанию и ремонту велосипеда — например, про скрип цепи, ' +
    'настройку тормозов, переключателей или давление в шинах. Уточните, что именно беспокоит?\n\n' +
    '(Это демо-ответ, так как ANTHROPIC_API_KEY не настроен.)'
  );
}

export async function sendChatMessage(history: ChatMessage[], newText: string): Promise<string> {
  if (!API_KEY) {
    await new Promise((r) => setTimeout(r, 400));
    return mockReply(newText);
  }

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.text })),
    { role: 'user' as const, content: newText },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  return textBlock?.text ?? 'Не удалось получить ответ. Попробуйте ещё раз.';
}

export const isAiConfigured = Boolean(API_KEY);

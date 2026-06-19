import { findVideoGuide as mockVideoGuide, searchBikeOffers as mockBikeOffers, searchMarketplaceOffers as mockPartOffers } from '../data/mock';
import { ChatMessage, MarketplaceOffer, VideoGuide } from '../types';

// MVP-only: calls Gemini directly from the client. EXPO_PUBLIC_* vars are
// bundled into the app and extractable, so before shipping move this call
// behind a backend proxy (e.g. a Supabase Edge Function) that holds the key.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const isAiConfigured = Boolean(API_KEY);

const CHAT_SYSTEM_PROMPT =
  'Ты — дружелюбный эксперт по обслуживанию и ремонту велосипедов. ' +
  'Объясняй простыми словами, как новичку, который ничего не понимает в устройстве велосипеда. ' +
  'Давай чёткие пошаговые инструкции, называй нужные инструменты и запчасти. ' +
  'Если нужно — используй веб-поиск, чтобы проверить актуальные данные (например, момент затяжки болтов для конкретной модели). ' +
  'Если вопрос не про велосипеды — мягко верни разговор к теме велосипедов.';

interface GeminiPart {
  text?: string;
}

async function callGemini(body: Record<string, unknown>): Promise<string> {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const parts: GeminiPart[] = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p) => p.text ?? '')
    .join('')
    .trim();
}

function extractJsonBlock(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];
  return text.trim();
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function sendChatMessage(history: ChatMessage[], newText: string): Promise<string> {
  if (!API_KEY) {
    await new Promise((r) => setTimeout(r, 400));
    return mockChatReply(newText);
  }

  const contents = [
    ...history.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: newText }] },
  ];

  const text = await callGemini({
    systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
    contents,
    tools: [{ google_search: {} }],
  });

  return text || 'Не удалось получить ответ. Попробуйте ещё раз.';
}

function mockChatReply(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes('скрип') && text.includes('цеп')) {
    return (
      'Скрип цепи почти всегда означает сухость или загрязнение:\n\n' +
      '1. Протрите цепь сухой тряпкой, чтобы убрать грязь и старую смазку.\n' +
      '2. Нанесите велосипедную смазку для цепи на каждое звено, покручивая педали назад.\n' +
      '3. Подождите 5–10 минут, затем протрите излишки смазки тряпкой.\n' +
      '4. Если скрип не ушёл — проверьте натяжение цепи и состояние звёздочек на износ.\n\n' +
      '(Это демо-ответ. Подключите EXPO_PUBLIC_GEMINI_API_KEY, чтобы получать реальные ответы от ИИ.)'
    );
  }
  return (
    'Я могу подсказать по обслуживанию и ремонту велосипеда. Уточните, что именно беспокоит?\n\n' +
    '(Это демо-ответ, так как EXPO_PUBLIC_GEMINI_API_KEY не настроен.)'
  );
}

export async function searchPartOffers(partName: string, bikeModel: string): Promise<MarketplaceOffer[]> {
  if (!API_KEY) return mockPartOffers(partName, bikeModel);

  const prompt =
    `Найди, где купить запчасть "${partName}" для велосипеда "${bikeModel}" на маркетплейсах ` +
    'Ozon, Wildberries, Avito и AliExpress. Ответь СТРОГО в формате JSON-массива без markdown и ' +
    'пояснений, 4-6 элементов, каждый: {"marketplace":"Ozon|Wildberries|Avito|AliExpress",' +
    '"title":"...","price":число,"currency":"₽","url":"настоящая прямая ссылка, найденная через поиск"}.';

  try {
    const text = await callGemini({ contents: [{ role: 'user', parts: [{ text: prompt }] }], tools: [{ google_search: {} }] });
    const parsed = JSON.parse(extractJsonBlock(text));
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');

    return parsed.map((item, index) => ({
      id: `gemini-offer-${index}`,
      marketplace: item.marketplace,
      title: String(item.title),
      price: Number(item.price) || 0,
      currency: String(item.currency || '₽'),
      url: String(item.url),
    }));
  } catch {
    return mockPartOffers(partName, bikeModel);
  }
}

export async function searchBikeOffers(bikeModel: string): Promise<MarketplaceOffer[]> {
  if (!API_KEY) return mockBikeOffers(bikeModel);

  const prompt =
    `Найди, где купить велосипед "${bikeModel}" на маркетплейсах Ozon, Wildberries и Avito. ` +
    'Ответь СТРОГО в формате JSON-массива без markdown и пояснений, 3-5 элементов, каждый: ' +
    '{"marketplace":"Ozon|Wildberries|Avito","title":"...","price":число,"currency":"₽",' +
    '"url":"настоящая прямая ссылка, найденная через поиск"}.';

  try {
    const text = await callGemini({ contents: [{ role: 'user', parts: [{ text: prompt }] }], tools: [{ google_search: {} }] });
    const parsed = JSON.parse(extractJsonBlock(text));
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');

    return parsed.map((item, index) => ({
      id: `gemini-bike-${index}`,
      marketplace: item.marketplace,
      title: String(item.title),
      price: Number(item.price) || 0,
      currency: String(item.currency || '₽'),
      url: String(item.url),
    }));
  } catch {
    return mockBikeOffers(bikeModel);
  }
}

export async function findVideoGuide(partName: string, bikeModel: string): Promise<VideoGuide> {
  if (!API_KEY) return mockVideoGuide(partName);

  const prompt =
    `Найди на YouTube хорошее видео-инструкцию по установке/замене запчасти "${partName}" ` +
    `на велосипеде (модель: "${bikeModel}" или похожий тип велосипеда), желательно на русском языке. ` +
    'Ответь СТРОГО в формате JSON-объекта без markdown: {"title":"...","channel":"...",' +
    '"url":"настоящая ссылка вида https://www.youtube.com/watch?v=...","durationLabel":"мм:сс"}.';

  try {
    const text = await callGemini({ contents: [{ role: 'user', parts: [{ text: prompt }] }], tools: [{ google_search: {} }] });
    const parsed = JSON.parse(extractJsonBlock(text));
    const youtubeId = extractYoutubeId(String(parsed.url ?? ''));
    if (!youtubeId) throw new Error('no video id');

    return {
      id: `gemini-video-${youtubeId}`,
      youtubeId,
      title: String(parsed.title || `Как установить: ${partName}`),
      channel: String(parsed.channel || 'YouTube'),
      durationLabel: String(parsed.durationLabel || ''),
    };
  } catch {
    return mockVideoGuide(partName);
  }
}

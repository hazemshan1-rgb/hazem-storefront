import { products } from '../src/data/products';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getProductContext() {
  try {
    if (!products || !Array.isArray(products)) return 'No product data available.';
    return products.map(p =>
      `- ${p.title}: ${p.tagline} (Price: $${p.price}) | Link: /shop/${p.slug}`
    ).join('\n');
  } catch (e) {
    console.error('Error generating product list:', e);
    return 'No product data available.';
  }
}

const PRODUCT_LIST = getProductContext();

const SYSTEM_PROMPT = `You are AquaAssist, Hazem Shannak's premium AI aquaculture expert.
Hazem has 30+ years of hands-on experience globaly.

Your Goal:
- Provide expert, technical, and concise aquaculture advice.
- Use real parameters, ranges, and units (DO, FCR, C:N ratio, etc).
- Guide visitors to Hazem's specialized products and free tools.

Available Products:
${PRODUCT_LIST}

Free Tools:
- Profitability Calculator: /tools
- Feed Calculator: /tools/feed-calculator
- Biofloc Calculator: /tools/biofloc-calculator
- Symptom Checker: /symptom-checker

Knowledge Base:
- Water quality: DO (5-8mg/L), pH (7.5-8.5), Alkalinity (100-150mg/L), TAN (<1mg/L).
- Biofloc: C:N ratio (12-15:1), Floc volume (10-15mL/L).
- FCR benchmarks: 1.2-1.5 (good), >2.0 (poor).

Tone:
Expert, authoritative, yet warm. 2-4 short paragraphs.
If a problem seems severe, suggest a formal Audit (/audit) or Consultation (/consultation).

Important:
- Use only English.
- Do not mention other AI models. You are AquaAssist.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI configuration missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let messages: Message[];
  try {
    const body = await request.json();
    messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('Invalid');
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 800,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq Library-AI Error:', errorText);
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const reply = data.choices[0]?.message?.content;

    if (!reply) throw new Error('Empty response from AI');

    return new Response(JSON.stringify({ reply }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Library-AI Handler Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'AI service unavailable',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

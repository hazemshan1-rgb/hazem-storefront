const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Hardcoded product list to avoid bundling issues with 'src/' imports in Vercel functions
const PRODUCT_LIST = `
- 10 Ways to Ruin a Biofloc System: The failure modes that kill BFT cycles — mapped so you can avoid every one. (Price: $0) | Link: /shop/free-biofloc-guide
- Aquaculture Profit Leak Audit: Find and fix the hidden losses draining your farm — in a single day. (Price: $0) | Link: /shop/aquaculture-profit-leak-audit
- The Shrimp IMTA Primer: Three crops, one pond, better margins — the case for IMTA in 15 minutes. (Price: $27) | Link: /shop/shrimp-imta-primer
- 7 Strategies for Waste-Free Shrimp Farming: Proven frameworks for sustainable, low-waste shrimp production. (Price: $0) | Link: /shop/free-7-strategies-waste-free-shrimp
- FCR Optimisation Toolkit: Reduce your feed costs by 15-20% with precision management. (Price: $147) | Link: /shop/fcr-optimisation-toolkit
- Biofloc Management Complete Guide: The definitive manual for high-density BFT systems. (Price: $197) | Link: /shop/biofloc-management-complete-guide
`;

const SYSTEM_PROMPT = `You are AquaAssist, Hazem Shannak's premium AI aquaculture expert.
Hazem has 30+ years of hands-on experience in shrimp farming, biofloc technology (BFT), Moringa-based feeds, and sustainable aquaculture across Malaysia, Thailand, Saudi Arabia, and the Philippines.

Your Goal:
1. Provide expert, technical, and concise aquaculture advice.
2. Guide visitors to Hazem's specialized products and free tools.
3. Encourage consultations for complex or high-stakes operational issues.

Knowledge Base:
- Water quality: DO (5-8mg/L), pH (7.5-8.5), Alkalinity (100-150mg/L), TAN (<1mg/L).
- Biofloc: C:N ratio (12-15:1), Floc volume (10-15mL/L).
- FCR benchmarks: 1.2-1.5 (good), >2.0 (poor).

Available Products:
${PRODUCT_LIST}

Free Tools:
- Profitability Calculator: /tools
- Feed Calculator: /tools/feed-calculator
- Biofloc Calculator: /tools/biofloc-calculator

Tone:
Expert, authoritative, yet warm and helpful. Keep responses to 2-4 short paragraphs.
If a problem seems severe, suggest a formal Audit (/audit) or Consultation (/consultation).
Never invent prices not listed above.

Important:
- Use only English.
- Do not mention other AI models (like Claude or GPT). You are AquaAssist.`;

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
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('Invalid messages');
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
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // Keep context window manageable
        ],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq API Error Response:', errorText);
      let errorMsg = 'Groq API error';
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson?.error?.message || errorMsg;
      } catch {
        errorMsg = `API Error ${groqRes.status}: ${errorText.substring(0, 100)}`;
      }
      throw new Error(errorMsg);
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
    console.error('AquaAssist Chat Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'AI service unavailable',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

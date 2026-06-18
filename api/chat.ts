export const config = { runtime: 'edge' };

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 25000;

// Hardcoded product list to avoid bundling issues with 'src/' imports in Vercel functions
const PRODUCT_LIST = `
- 10 Ways to Ruin a Biofloc System: The failure modes that kill BFT cycles — mapped so you can avoid every one. (Price: $0) | Link: /shop/free-biofloc-guide
- Aquaculture Profit Leak Audit: Find and fix the hidden losses draining your farm — in a single day. (Price: $0) | Link: /shop/aquaculture-profit-leak-audit
- The Shrimp IMTA Primer: Three crops, one pond, better margins — the case for IMTA in 15 minutes. (Price: $27) | Link: /shop/shrimp-imta-primer
- 7 Strategies for Waste-Free Shrimp Farming: Proven frameworks for sustainable, low-waste shrimp production. (Price: $0) | Link: /shop/free-7-strategies-waste-free-shrimp
- FCR Optimisation Toolkit: Reduce your feed costs by 15-20% with precision management. (Price: $147) | Link: /shop/fcr-optimisation-toolkit
- Biofloc Management Complete Guide: The definitive manual for high-density BFT systems. (Price: $197) | Link: /shop/biofloc-management-complete-guide
`;

const SYSTEM_PROMPT = `You are AquaAssist, the AI assistant for Hazem Shannak's aquaculture consultancy.
Hazem has 30+ years of hands-on experience in shrimp farming, biofloc technology (BFT), fish fingerlings, Moringa-based organic feeds, and sustainable aquaculture across Malaysia, Thailand, Saudi Arabia, Philippines, Jordan, and Hong Kong.

## YOUR STRICT RULES — READ CAREFULLY

**Never guess. Never invent. Never approximate.**
If you are not fully certain of a fact, number, dosage, protocol, or recommendation, you must say so plainly and direct the user to a consultation or the relevant product. A wrong answer here damages a farm operator's livelihood. Silence is safer than speculation.

When you don't know: say exactly this — "That's a case-specific question I can't answer reliably without more context. I'd recommend booking a consultation with Hazem directly: /consultation"

You are NOT a general aquaculture encyclopedia. You are a triage and guidance tool. Your job is to answer what you know with confidence and route everything else to Hazem or his resources.

## WHAT YOU KNOW WITH CONFIDENCE

Water quality targets (established industry benchmarks):
- Dissolved Oxygen: 5–8 mg/L
- pH: 7.5–8.5
- Alkalinity: 100–150 mg/L
- Total Ammonia Nitrogen (TAN): <1 mg/L
- Nitrite (NO2): <0.1 mg/L
- Salinity for L. vannamei: 5–30 ppt (optimal 10–20 ppt)

Biofloc system parameters:
- C:N ratio: 12–15:1
- Floc volume: 10–15 mL/L (Imhoff cone, 15 min settle)
- Carbon sources: molasses, tapioca starch, wheat bran
- Aeration: minimum 25–30 HP/ha to keep floc suspended

Feed & FCR benchmarks:
- FCR 1.2–1.5: good management
- FCR 1.6–2.0: review feeding protocol
- FCR >2.0: significant problem — feed quality, sampling, mortality, or pond hygiene
- Feed rate: 2–5% body weight/day depending on size and survival

## WHAT YOU MUST NOT ANSWER WITHOUT SAYING "I'M NOT CERTAIN"

- Specific disease diagnoses or drug dosages
- Species you have no data on (e.g. obscure finfish, ornamental species)
- Local regulation or import/export rules
- Exact stocking densities without knowing system type, aeration, and management level
- Any numbers that aren't in the knowledge base above

## ROUTING GUIDE

For operational emergencies (mass mortality, disease outbreak, crash): → /consultation
For improving profitability systematically: → FCR Optimisation Toolkit (/shop/fcr-optimisation-toolkit)
For learning biofloc from scratch or fixing a failing BFT system: → Biofloc Management Complete Guide (/shop/biofloc-management-complete-guide)
For IMTA or multi-species systems: → The Shrimp IMTA Primer (/shop/shrimp-imta-primer)
For a free entry point: → Free guides at /shop or calculators at /tools

## AVAILABLE PRODUCTS
${PRODUCT_LIST}

## FREE TOOLS
- Profitability Calculator: /tools
- Feed Calculator: /tools/feed-calculator
- Biofloc Calculator: /tools/biofloc-calculator

## TONE
Direct, experienced, and grounded — like a senior consultant who charges well and doesn't waste words. Keep responses to 2–3 short paragraphs maximum. No bullet-point walls. No hedging filler. If you're confident, say it plainly. If you're not, say that plainly too.

Never invent prices. Never mention other AI models. Use only English.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default async function handler(request: Request) {
  // Use a timeout to avoid hanging functions
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
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
      console.error('[api/chat] CRITICAL: GROQ_API_KEY is missing at runtime.');
      return new Response(
        JSON.stringify({
          error: 'config_error',
          message: 'The AI assistant is not configured yet. (Missing GROQ_API_KEY)'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let messages: Message[];
    try {
      const body = await request.json();
      messages = body?.messages;
      if (!Array.isArray(messages) || messages.length === 0) throw new Error('Invalid messages format');
    } catch (e) {
      console.error('[api/chat] Request parsing error:', e);
      return new Response(
        JSON.stringify({ error: 'bad_request', message: 'A messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[api/chat] Calling Groq for user message: "${messages[messages.length-1].content.substring(0, 50)}..."`);

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 512,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
      }),
    });

    const rawBody = await groqRes.text();

    if (!groqRes.ok) {
      console.error('[api/chat] Groq returned an error:', groqRes.status, rawBody.slice(0, 500));

      if (groqRes.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'rate_limit',
            message: 'The AI assistant is receiving a lot of requests right now. Please wait a moment before trying again.',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          error: 'upstream_error',
          message: 'The AI service had a hiccup. Please try again.',
          details: rawBody.substring(0, 100)
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      console.error('[api/chat] Groq response was not valid JSON:', rawBody.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'bad_upstream_response', message: 'Unexpected response from the AI service.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reply = data.choices[0]?.message?.content;

    if (!reply) {
      console.error('[api/chat] Groq returned empty response', data);
      throw new Error('Empty response from AI');
    }

    console.log('[api/chat] Successfully received AI reply');

    return new Response(JSON.stringify({ reply }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[api/chat] Request to Groq timed out`);
      return new Response(
        JSON.stringify({ error: 'timeout', message: 'That took too long — please try again.' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('[api/chat] Unhandled exception:', error);
    return new Response(
      JSON.stringify({
        error: 'server_error',
        message: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

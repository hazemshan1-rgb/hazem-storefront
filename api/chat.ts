const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 25000; // Increased to 25s to stay under platform limits

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
Hazem has 30+ years of hands-on experience in shrimp farming, biofloc technology (BFT), fish fingerlings, Moringa-based organic feeds, and sustainable aquaculture across Malaysia, Thailand, Saudi Arabia, Philippines, Jordan, and Hong Kong.

Your Goal:
1. Provide expert, technical, and concise aquaculture advice.
2. Guide visitors to choose the right ebook, SOP, toolkit, or consultation for their farm stage or challenge.
3. Answer aquaculture questions: shrimp farming, water quality, feed management, biofloc, disease prevention, pond design, fingerling production.
4. Encourage consultations for complex or high-stakes operational issues.

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
Expert, authoritative, yet warm and helpful — like a seasoned mentor. Keep responses to 2-4 short paragraphs.
If a problem seems severe, suggest a formal Audit (/audit) or Consultation (/consultation).
Never invent prices not listed above; say "check the store page for current pricing" for unlisted items.

Important:
- Use only English.
- Do not mention other AI models (like Claude or GPT). You are AquaAssist.`;

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

    // 1. Fail fast and CLEARLY if the key isn't actually live on this deployment.
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[api/chat] CRITICAL: GROQ_API_KEY is missing at runtime on this deployment.');
      return new Response(
        JSON.stringify({
          error: 'config_error',
          message: 'The AI assistant is not configured yet. (Missing GROQ_API_KEY on this deployment.)'
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
      const status = groqRes.status === 429 ? 429 : 502;
      return new Response(
        JSON.stringify({
          error: status === 429 ? 'rate_limit' : 'upstream_error',
          message: status === 429
            ? 'Too many messages right now — please wait a moment and try again.'
            : 'The AI service had a hiccup. Please try again.',
          details: rawBody.substring(0, 100)
        }),
        { status: status, headers: { 'Content-Type': 'application/json' } }
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
      console.error(`[api/chat] Request to Groq timed out after ${REQUEST_TIMEOUT_MS}ms`);
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

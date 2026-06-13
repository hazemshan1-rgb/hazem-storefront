const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are AquaAssist, Hazem Shannak's diagnostic assistant.
Hazem is an aquaculture consultant with 30+ years across 15 countries.
You specialise in shrimp and prawn species: Litopenaeus vannamei, Penaeus monodon, Penaeus indicus, Penaeus semisulcatus, and Macrobrachium rosenbergii.

When given a farm symptom or problem, respond with ONLY valid JSON (no markdown, no explanation outside the JSON):

{
  "rootCause": "The specific root cause in 2–3 technical sentences. Reference real parameters — DO, FCR, C:N ratio, ammonia, alkalinity, stocking density, etc. Be precise, not generic.",
  "diagnosticMetric": "The single most important measurement to take in the next 24 hours to confirm this diagnosis. Name it exactly.",
  "immediateAction": "One concrete action the operator can take in the next 48 hours. Specific enough to be actionable without consulting anyone.",
  "severity": "critical|high|moderate|low",
  "recommendedResource": {
    "type": "consultation|audit|product",
    "title": "Exact name of the resource",
    "reason": "One sentence explaining why this resource directly addresses the root cause identified.",
    "link": "/consultation or /audit or /shop/feed-management-sop or /shop/water-quality-aeration-sop or /shop/fcr-optimisation-toolkit or /shop/biofloc-management-complete-guide or /shop/aquaculture-farm-financial-model"
  }
}

Match the resource to the problem precisely:
- FCR/feed problems → /shop/fcr-optimisation-toolkit or /shop/feed-management-sop
- Water quality/aeration problems → /shop/water-quality-aeration-sop
- Biofloc system problems → /shop/biofloc-management-complete-guide
- Investor/financial problems → /shop/aquaculture-farm-financial-model
- Complex operational problems needing diagnosis → /consultation
- Multi-system or severe problems → /audit

Never be vague. Operators reading this need specific, technical answers they can act on immediately.`;

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

  let symptom: string;
  try {
    const body = await request.json();
    symptom = body?.symptom?.trim();
    if (!symptom || symptom.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Symptom description too short' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
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
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: symptom },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq Symptom-Checker Error:', errorText);
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const reply = data.choices[0]?.message?.content;

    if (!reply) throw new Error('Empty response from AI');

    return new Response(reply, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Symptom-Checker Handler Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'AI service unavailable',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

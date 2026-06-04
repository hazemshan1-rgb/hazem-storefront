import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a diagnostic assistant for Hazem Shannak, an aquaculture consultant with 30+ years across 15 countries. You specialise in shrimp and prawn species: Litopenaeus vannamei, Penaeus monodon, Penaeus indicus, Penaeus semisulcatus, and Macrobrachium rosenbergii.

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

Never be vague. Operators reading this need specific, technical answers they can act on immediately.`

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let symptom: string
  try {
    const body = await request.json()
    symptom = body?.symptom?.trim()
    if (!symptom || symptom.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Symptom description too short' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: symptom }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to parse diagnosis' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(JSON.stringify(parsed), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

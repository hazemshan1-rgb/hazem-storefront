import Anthropic from '@anthropic-ai/sdk'
import { Client } from '@notionhq/client'
import type { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

// ─── Notion database IDs (created 2026-06-04, edit via Notion workspace) ───
const NOTION_SERVICES_DB = '9b5ab30279ee406fa9de43de03098fb2'
const NOTION_FAQS_DB     = 'fdacb990d7c44e198b5e8bf574a4817e'
const NOTION_LOGS_DB     = '670b0f0bbbd84720a552c4c0c4f469ed'
const NOTION_PERSONA_PAGE = '375da67602f181c2b529d0e343d8f19b'

// ─── Fallback system prompt (used when Notion is not configured) ─────────────
const SYSTEM_FALLBACK = `You are the AI Business Consultant for Hazem Shannak — a specialist in turning underperforming aquaculture ventures into high-yield, investment-ready enterprises. Hazem has 30+ years of hands-on experience globally deployed across aquaculture, regenerative agriculture, and sustainable food systems.

Answer directly and specifically. Use real parameters, ranges, and units. Suggest Hazem's products or services only when they directly address the question — one mention, at the end. Keep answers to 2–4 paragraphs unless more is clearly needed. Never fabricate statistics or research findings.`

// ─── Aquaculture knowledge base (always included, not editable via Notion) ───
const KNOWLEDGE_BASE = `
## Core aquaculture knowledge

### Water quality
- Dissolved oxygen (DO): target 5–8 mg/L intensive; below 4 mg/L critical
- pH: optimal 7.5–8.5; lime correction (agricultural lime, dolomite, bicarbonate)
- Alkalinity: optimal 100–150 mg/L as CaCO₃; bicarbonate buffering; C:N ratio in BFT
- Ammonia (TAN/NH₃): TAN < 1 mg/L, un-ionised NH₃ < 0.1 mg/L
- Nitrite: < 0.5 mg/L; salt addition reduces toxicity
- Salinity: vannamei optimal 10–25 ppt; monodon 15–30 ppt
- Temperature: vannamei 23–30°C optimal

### Feed management
- FCR calculation: total feed used ÷ total biomass gained
- Industry benchmarks: vannamei intensive 1.2–1.5 good; 1.6–1.8 average; >2.0 poor
- Feed tray method: 4–6 trays per pond; check every 2–3 hours
- Feed cost: typically 55–65% of total production cost

### Biofloc technology (BFT)
- C:N ratio management: target 12–15:1; carbon sources (molasses, tapioca starch)
- Floc volume: optimal 10–15 mL/L; measure with Imhoff cone
- Alkalinity consumption: supplement daily; critical for system stability
- Aeration: 8–12 kg O₂/kg feed as rough guide

### Disease management
- WSSV: most devastating; biosecurity is primary prevention
- EMS/AHPND: Vibrio parahaemolyticus; hepatopancreas necrosis
- NHP: intracellular bacterium; dry feed, stress triggers
- Biosecurity: fomites, bird control, PCR testing at PLs

### Farm economics
- Cost-per-kg: total production cost ÷ total harvest kg
- EBITDA multiples: typical 3–5× for aquaculture farms
- Each 0.1 FCR improvement ≈ 5–8% feed cost reduction`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── Notion helpers ───────────────────────────────────────────────────────────

function extractRichText(rich: RichTextItemResponse[]): string {
  return rich.map(r => r.plain_text).join('')
}

function extractBlockText(block: BlockObjectResponse): string {
  const b = block as Record<string, unknown>
  const type = block.type as string
  const typed = b[type] as { rich_text?: RichTextItemResponse[] } | undefined
  if (!typed?.rich_text) return ''
  return extractRichText(typed.rich_text)
}

async function fetchNotionContext(notion: Client): Promise<string> {
  const [personaBlocks, servicesResp, faqsResp] = await Promise.all([
    notion.blocks.children.list({ block_id: NOTION_PERSONA_PAGE }).catch(() => null),
    notion.databases.query({
      database_id: NOTION_SERVICES_DB,
      filter: { property: 'Active', checkbox: { equals: true } },
    }).catch(() => null),
    notion.databases.query({
      database_id: NOTION_FAQS_DB,
      filter: { property: 'Active', checkbox: { equals: true } },
    }).catch(() => null),
  ])

  const sections: string[] = []

  // Persona
  if (personaBlocks?.results?.length) {
    const personaText = personaBlocks.results
      .filter((b): b is BlockObjectResponse => 'type' in b)
      .map(extractBlockText)
      .filter(Boolean)
      .join('\n')
    if (personaText) sections.push(`## Agent persona\n${personaText}`)
  }

  // Services
  if (servicesResp?.results?.length) {
    const lines = servicesResp.results.map(page => {
      const p = (page as Record<string, unknown>).properties as Record<string, Record<string, unknown>>
      const name  = extractRichText((p['Name']?.title ?? []) as RichTextItemResponse[])
      const price = extractRichText((p['Price']?.rich_text ?? []) as RichTextItemResponse[])
      const tier  = (p['Tier']?.select as { name?: string } | null)?.name ?? ''
      const desc  = extractRichText((p['Description']?.rich_text ?? []) as RichTextItemResponse[])
      const cta   = extractRichText((p['CTA']?.rich_text ?? []) as RichTextItemResponse[])
      return `- **${name}** (${tier}, ${price}): ${desc} | CTA: ${cta}`
    })
    sections.push(`## Current services & pricing\n${lines.join('\n')}`)
  }

  // FAQs
  if (faqsResp?.results?.length) {
    const lines = faqsResp.results.map(page => {
      const p = (page as Record<string, unknown>).properties as Record<string, Record<string, unknown>>
      const q = extractRichText((p['Question']?.title ?? []) as RichTextItemResponse[])
      const a = extractRichText((p['Answer']?.rich_text ?? []) as RichTextItemResponse[])
      return `Q: ${q}\nA: ${a}`
    })
    sections.push(`## Curated FAQs\n${lines.join('\n\n')}`)
  }

  return sections.join('\n\n')
}

async function logConversation(
  notion: Client,
  sessionId: string,
  userQuestion: string,
  aiResponse: string,
): Promise<void> {
  // truncate to Notion rich_text limit (2000 chars)
  const truncate = (s: string, n = 1800) => s.length > n ? s.slice(0, n) + '…' : s
  await notion.pages.create({
    parent: { database_id: NOTION_LOGS_DB },
    properties: {
      Session:           { title:     [{ text: { content: sessionId } }] },
      'User Question':   { rich_text: [{ text: { content: truncate(userQuestion) } }] },
      'AI Response':     { rich_text: [{ text: { content: truncate(aiResponse) } }] },
    },
  })
}

// ─── Main handler ─────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let messages: Message[]
  try {
    const body = await request.json()
    messages = body?.messages
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('invalid')
    const last = messages[messages.length - 1]
    if (!last?.content?.trim() || last.content.trim().length < 3) throw new Error('too short')
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // Build system prompt — Notion context injected when API key is present
  let system = SYSTEM_FALLBACK
  const notionKey = process.env.NOTION_API_KEY
  let notion: Client | null = null

  if (notionKey) {
    notion = new Client({ auth: notionKey })
    try {
      const notionContext = await fetchNotionContext(notion)
      if (notionContext) {
        system = `${notionContext}\n\n${KNOWLEDGE_BASE}`
      }
    } catch {
      // Notion unavailable — fall back silently
    }
  } else {
    system = `${SYSTEM_FALLBACK}\n\n${KNOWLEDGE_BASE}`
  }

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  // Fire-and-forget: log to Notion without blocking the response
  if (notion) {
    const sessionId = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const lastUserMsg = messages.filter(m => m.role === 'user').at(-1)?.content ?? ''
    logConversation(notion, sessionId, lastUserMsg, reply).catch(() => {})
  }

  return new Response(JSON.stringify({ reply }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

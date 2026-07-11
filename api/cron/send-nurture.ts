export const config = { runtime: 'edge' }

// Segmented nurture sequence for the Farm Diagnostic — Day 1 / Day 3 / Day 7,
// personalised by top-leak category. Triggered daily by Vercel Cron (see
// vercel.json). Runs in DRY-RUN mode (logs only, sends nothing, mutates
// nothing) unless NURTURE_LIVE_SEND=true is set — flip that only after the
// copy in _nurture-content.ts has been reviewed and approved.
//
// Uses the anon key + REST, same as the rest of /api — the existing RLS
// policy on diagnostic_results already permits SELECT where email IS NOT
// NULL, which covers every row this cron needs to read.

import { caseStudies } from '../../src/data/caseStudies'
import { buildDay1Html, buildDay3Html, buildDay7Html, CATEGORY_CASE_STUDY } from './_nurture-content'

const SUPABASE_URL      = 'https://gtvdzrzezdrwclhikccf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dmR6cnplemRyd2NsaGlrY2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjA3MzEsImV4cCI6MjA5NjMzNjczMX0.njx9pY6j3QdZe2cB0ZeUrAIZQHboa0f33UMw1LIgzfs'

const STAGE_GAP_DAYS = [2, 4] // stage 0→1 waits 2 more days (Day1→Day3), stage 1→2 waits 4 more (Day3→Day7)

interface NurtureRow {
  id: string
  email: string
  normalised_pct: number
  total_leak_usd: number
  top_leak_categories: number[]
  nurture_stage: number
}

export default async function handler(req: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const liveSend = process.env.NURTURE_LIVE_SEND === 'true'
  const resendApiKey = process.env.RESEND_API_KEY

  const rows = await fetchDueRows()
  const results: Array<{ id: string; stage: number; subject: string; sent: boolean }> = []

  for (const row of rows) {
    const topCategoryId = row.top_leak_categories?.[0]
    if (!topCategoryId) continue

    const email = buildEmailForStage(row, topCategoryId)
    if (!email) continue

    if (!liveSend) {
      results.push({ id: row.id, stage: row.nurture_stage, subject: `[DRY RUN] ${email.subject}`, sent: false })
      continue
    }

    if (!resendApiKey) {
      results.push({ id: row.id, stage: row.nurture_stage, subject: email.subject, sent: false })
      continue
    }

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Hazem Shannak <connect@hazemshannak.cc>',
        to: [row.email],
        subject: email.subject,
        html: email.html,
      }),
    })

    if (!sendRes.ok) {
      console.error('Nurture send failed', row.id, await sendRes.text())
      results.push({ id: row.id, stage: row.nurture_stage, subject: email.subject, sent: false })
      continue
    }

    await advanceStage(row)
    results.push({ id: row.id, stage: row.nurture_stage, subject: email.subject, sent: true })
  }

  return json({ dryRun: !liveSend, count: results.length, results })
}

async function fetchDueRows(): Promise<NurtureRow[]> {
  const nowIso = new Date().toISOString()
  const params = new URLSearchParams({
    select: 'id,email,normalised_pct,total_leak_usd,top_leak_categories,nurture_stage',
    email: 'not.is.null',
    nurture_stage: 'lt.3',
    next_nurture_at: `lte.${nowIso}`,
    limit: '100',
  })

  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnostic_results?${params.toString()}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  })

  if (!res.ok) {
    console.error('Failed to fetch due nurture rows', res.status, await res.text())
    return []
  }

  return (await res.json()) as NurtureRow[]
}

async function advanceStage(row: NurtureRow): Promise<void> {
  const nextStage = row.nurture_stage + 1
  const gapDays = STAGE_GAP_DAYS[row.nurture_stage] ?? null
  const nextNurtureAt = gapDays ? new Date(Date.now() + gapDays * 24 * 60 * 60 * 1000).toISOString() : null

  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnostic_results?id=eq.${row.id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ nurture_stage: nextStage, next_nurture_at: nextNurtureAt }),
  })

  if (!res.ok) console.error('Failed to advance nurture stage', row.id, await res.text())
}

function buildEmailForStage(row: NurtureRow, topCategoryId: number): { subject: string; html: string } | null {
  if (row.nurture_stage === 0) {
    return buildDay1Html({ score: row.normalised_pct, topCategoryId })
  }
  if (row.nurture_stage === 1) {
    const csIndex = CATEGORY_CASE_STUDY[topCategoryId]?.index ?? 0
    const cs = caseStudies[csIndex]
    return buildDay3Html({ topCategoryId, caseStudy: cs })
  }
  if (row.nurture_stage === 2) {
    const leakLow = Math.round((row.total_leak_usd * 0.7) / 1000) * 1000
    const leakHigh = Math.round((row.total_leak_usd * 1.3) / 1000) * 1000
    return buildDay7Html({ leakLow, leakHigh })
  }
  return null
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

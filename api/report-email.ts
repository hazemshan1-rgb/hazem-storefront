export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ReportField { label?: string; value?: string }

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let body: { name?: string; email?: string; source?: string; toolName?: string; inputs?: ReportField[]; results?: ReportField[] }
  try {
    body = await req.json() as typeof body
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const name     = (body.name ?? '').trim().slice(0, 128)
  const email    = (body.email ?? '').trim().toLowerCase()
  const source   = (body.source ?? 'unknown').trim().slice(0, 64)
  const toolName = (body.toolName ?? 'Storefront Tool').trim().slice(0, 128)
  const inputs   = Array.isArray(body.inputs) ? body.inputs.slice(0, 30) : []
  const results  = Array.isArray(body.results) ? body.results.slice(0, 30) : []

  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }

  const webhook = process.env.ZAPIER_REPORT_EMAIL_WEBHOOK_URL
  if (!webhook) {
    return json({ error: 'Report email is not configured yet' }, 503)
  }

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      source,
      tool_name: toolName,
      inputs,
      results,
      sent_at: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Zapier report webhook error', res.status, detail)
    return json({ error: 'Failed to send report' }, 500)
  }

  return json({ success: true })
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

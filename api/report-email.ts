export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ReportField { label?: string; value?: string }

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function fieldRows(fields: ReportField[]): string {
  return fields
    .map(f => `<tr><td style="padding:6px 0;border-bottom:1px dotted #ddd;color:#111;">${escapeHtml(String(f.label ?? ''))}</td><td style="padding:6px 0;border-bottom:1px dotted #ddd;color:#111;text-align:right;">${escapeHtml(String(f.value ?? ''))}</td></tr>`)
    .join('')
}

// Renders the same structure as the on-site PDF export (ReportExport.tsx) as
// email-safe HTML — inline styles only, table layout, no CSS variables or
// flexbox, since email clients don't reliably support those.
function buildReportHtml(name: string, toolName: string, inputs: ReportField[], results: ReportField[]): string {
  const greetingName = name ? escapeHtml(name) : 'there'
  return `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:20px;margin:0 0 4px 0;">${escapeHtml(toolName)} — Report</p>
  <p style="font-size:11px;color:#666;margin:0 0 24px 0;">Prepared for ${greetingName} · hazemshannak.cc</p>

  <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #ccc;padding-bottom:4px;margin:20px 0 8px 0;">Inputs</h3>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">${fieldRows(inputs)}</table>

  <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #ccc;padding-bottom:4px;margin:20px 0 8px 0;">Results</h3>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">${fieldRows(results)}</table>

  <div style="margin-top:24px;padding:14px 16px;border:1px solid #ccc;border-radius:4px;">
    <p style="font-size:14px;font-weight:bold;margin:0 0 6px 0;">Want this fixed, not just measured?</p>
    <p style="font-size:12px;color:#333;margin:0;">
      The Farm Profit-Leak Audit prices every leak on your farm from your own numbers — $4,500–$7,500.
      <a href="https://hazemshannak.cc/audit" style="color:#8B6914;">hazemshannak.cc/audit</a>
    </p>
  </div>

  <p style="margin-top:32px;font-size:11px;color:#777;border-top:1px solid #ccc;padding-top:12px;">
    Hazem Shannak, Director &amp; Business Growth Architect · hazemshannak.cc · connect@hazemshannak.cc
  </p>
</div>`
}

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
  const toolName = (body.toolName ?? 'Storefront Tool').trim().slice(0, 128)
  const inputs   = Array.isArray(body.inputs) ? body.inputs.slice(0, 30) : []
  const results  = Array.isArray(body.results) ? body.results.slice(0, 30) : []

  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return json({ error: 'Report email is not configured yet' }, 503)
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hazem Shannak <connect@hazemshannak.cc>',
      to: [email],
      bcc: ['connect@hazemshannak.cc'],
      subject: `Your ${toolName} Report — hazemshannak.cc`,
      html: buildReportHtml(name, toolName, inputs, results),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend send error', res.status, detail)
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

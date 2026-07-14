export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface ApplicationBody {
  tier?: number
  name?: string
  email?: string
  farmLocation?: string
  monthlyRevenueBand?: string
  pondCount?: string
  species?: string
  biggestProblem?: string
}

function buildNotificationHtml(body: ApplicationBody): string {
  const rows: [string, string][] = [
    ['Tier', `Tier ${body.tier}`],
    ['Name', body.name ?? ''],
    ['Email', body.email ?? ''],
    ['Farm location', body.farmLocation ?? ''],
    ['Monthly revenue band', body.monthlyRevenueBand ?? ''],
    ['Pond count', body.pondCount ?? '—'],
    ['Species', body.species ?? '—'],
  ]
  const rowsHtml = rows
    .map(([label, value]) => `<tr><td style="padding:6px 0;border-bottom:1px dotted #ddd;color:#666;">${escapeHtml(label)}</td><td style="padding:6px 0;border-bottom:1px dotted #ddd;color:#111;text-align:right;">${escapeHtml(value)}</td></tr>`)
    .join('')

  return `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:20px;margin:0 0 4px 0;">New Tier ${body.tier} Application</p>
  <p style="font-size:11px;color:#666;margin:0 0 24px 0;">hazemshannak.cc/audit</p>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">${rowsHtml}</table>
  <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #ccc;padding-bottom:4px;margin:20px 0 8px 0;">Biggest current problem</h3>
  <p style="font-size:13px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(body.biggestProblem ?? '')}</p>
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

  let body: ApplicationBody
  try {
    body = await req.json() as ApplicationBody
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }
  if (body.tier !== 2 && body.tier !== 3) {
    return json({ error: 'Invalid tier' }, 400)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    // Supabase insert already happened client-side and is the source of
    // truth — a missing key here should not surface as a failed application.
    return json({ success: true, notified: false })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hazem Shannak <connect@hazemshannak.cc>',
      to: ['connect@hazemshannak.cc'],
      reply_to: email,
      subject: `Tier ${body.tier} Application — ${body.name ?? 'Unknown'}`,
      html: buildNotificationHtml(body),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend send error', res.status, detail)
    return json({ success: true, notified: false })
  }

  return json({ success: true, notified: true })
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

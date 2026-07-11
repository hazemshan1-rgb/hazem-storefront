export const config = { runtime: 'edge' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sends a link back to the in-progress diagnostic draft. Reuses the same
// direct-Resend-fetch pattern as report-email.ts — no new dependency.
function buildResumeHtml(resumeUrl: string): string {
  return `<div style="font-family:Georgia,'Times New Roman',serif;color:#111;max-width:600px;margin:0 auto;">
  <p style="font-size:20px;margin:0 0 4px 0;">Finish your Farm Diagnostic</p>
  <p style="font-size:11px;color:#666;margin:0 0 24px 0;">hazemshannak.cc</p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 20px 0;">
    You started the Farm Health Diagnostic but didn't finish. Your answers so far are saved —
    pick up exactly where you left off.
  </p>

  <a href="${resumeUrl}" style="display:inline-block;background:#CA8A04;color:#0a1628;font-weight:bold;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;">
    Continue my diagnostic
  </a>

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

  let body: { email?: string; draftId?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const draftId = (body.draftId ?? '').trim()

  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }
  // UUID-shaped check only — the draft's existence and completed:false state
  // are enforced server-side by loadDraft()'s RLS-scoped query, not here.
  if (!/^[0-9a-f-]{36}$/i.test(draftId)) {
    return json({ error: 'Invalid draft id' }, 400)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return json({ error: 'Resume email is not configured yet' }, 503)
  }

  const origin = req.headers.get('origin') || 'https://hazemshannak.cc'
  const resumeUrl = `${origin}/diagnostic?resume=${encodeURIComponent(draftId)}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hazem Shannak <connect@hazemshannak.cc>',
      to: [email],
      subject: 'Finish your Farm Diagnostic — hazemshannak.cc',
      html: buildResumeHtml(resumeUrl),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend send error', res.status, detail)
    return json({ error: 'Failed to send resume link' }, 500)
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

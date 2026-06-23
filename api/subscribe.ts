// anon key is intentionally hardcoded — it's already public in the Vite client bundle
const SUPABASE_URL      = 'https://gtvdzrzezdrwclhikccf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dmR6cnplemRyd2NsaGlrY2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjA3MzEsImV4cCI6MjA5NjMzNjczMX0.njx9pY6j3QdZe2cB0ZeUrAIZQHboa0f33UMw1LIgzfs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  let body: { email?: string; source?: string }
  try {
    body = await req.json() as { email?: string; source?: string }
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const email  = (body.email ?? '').trim().toLowerCase()
  const source = (body.source ?? 'unknown').trim().slice(0, 64)

  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }

  // Plain INSERT — 409 conflict (duplicate email) is treated as success
  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, source }),
  })

  if (!res.ok && res.status !== 409) {
    const detail = await res.text()
    console.error('Supabase insert error', res.status, detail)
    return json({ error: 'Failed to save' }, 500)
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

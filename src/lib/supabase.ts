import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

// Stable per-browser-tab id, sent as a header so RLS policies scoped to
// "your own" rows (see the `anon read own diagnostic` / `anon update own
// diagnostic email` policies on diagnostic_results) can actually match it.
// Without this, an INSERT ... RETURNING on a row that has no email yet is
// invisible to its own SELECT policy and hard-fails with 42501 — the header
// existed in the RLS policy but nothing was ever sending it.
export function getSessionId(): string {
  let id = sessionStorage.getItem('hazem-session-id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('hazem-session-id', id)
  }
  return id
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers: { 'x-session-id': getSessionId() } },
})

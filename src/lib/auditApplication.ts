import { supabase } from './supabase'

export interface AuditApplicationInput {
  tier: 2 | 3
  name: string
  email: string
  farmLocation: string
  monthlyRevenueBand: string
  pondCount?: string
  species?: string
  biggestProblem: string
}

// Supabase insert is the source of truth (survives even if the notification
// email fails). The email to connect@hazemshannak.cc is fire-and-forget best
// effort — Hazem reviews applications personally per the on-page copy, so a
// missed notification shouldn't also mean a lost application.
export async function submitAuditApplication(
  input: AuditApplicationInput,
): Promise<{ success: boolean }> {
  const { error } = await supabase.from('audit_applications').insert({
    tier: input.tier,
    name: input.name,
    email: input.email,
    farm_location: input.farmLocation,
    monthly_revenue_band: input.monthlyRevenueBand,
    pond_count: input.pondCount || null,
    species: input.species || null,
    biggest_problem: input.biggestProblem,
  })

  if (error) {
    console.error('Failed to save audit application:', error)
    return { success: false }
  }

  void fetch('/api/audit-application', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).catch(err => console.error('Failed to send audit application notification:', err))

  return { success: true }
}

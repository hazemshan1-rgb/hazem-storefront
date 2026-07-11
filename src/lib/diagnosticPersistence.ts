import { supabase, getSessionId } from './supabase'
import type { ContextAnswers, DiagnosticAnswers, ScoreResult, Species, System } from '../data/diagnosticData'

// Mirrors every captured email into the single master `subscribers` list,
// regardless of which specialised table (diagnostic_results, course_waitlist)
// it also lives in. A duplicate-email conflict (23505) is expected and fine —
// it just means this person is already on the list.
async function mirrorToSubscribers(email: string, source: string): Promise<void> {
  const { error } = await supabase
    .from('subscribers')
    .insert({ email, source })

  if (error && error.code !== '23505') {
    console.error('Failed to mirror email to subscribers:', error)
  }
}

// `draftId` upserts onto an in-progress row created by saveDraft() below,
// instead of always inserting a fresh one — so an abandoned-then-resumed
// session ends up as one row, not two.
export async function saveDiagnosticResult(
  answers: DiagnosticAnswers,
  contextAnswers: ContextAnswers,
  result: ScoreResult,
  email?: string,
  draftId?: string,
): Promise<{ success: boolean; id?: string }> {
  const payload = {
    email: email || null,
    session_id: getSessionId(),
    species: contextAnswers.species || null,
    system: contextAnswers.system || null,
    normalised_pct: result.normalisedPct,
    total_leak_usd: Math.round(result.totalLeakUsd),
    category_scores: result.categoryScores,
    category_maxes: result.categoryMaxes,
    top_leak_categories: result.topLeakCategories,
    answers,
    context_answers: contextAnswers,
    completed: true,
    updated_at: new Date().toISOString(),
  }

  if (draftId) {
    const { error } = await supabase.from('diagnostic_results').update(payload).eq('id', draftId)
    if (error) {
      console.error('Failed to upsert diagnostic result onto draft:', error)
      return { success: false }
    }
    if (email) void mirrorToSubscribers(email, 'diagnostic-results')
    return { success: true, id: draftId }
  }

  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert(payload)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Failed to save diagnostic result:', error)
    return { success: false }
  }

  if (email) {
    void mirrorToSubscribers(email, 'diagnostic-results')
  }

  return { success: true, id: data?.id }
}

// Scheduling the first nurture touch here (not at completion) because email
// is usually captured a step later than the score itself — this is the point
// it actually becomes possible to email anyone.
export async function updateDiagnosticEmail(
  id: string,
  email: string,
): Promise<{ success: boolean }> {
  const nextNurtureAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('diagnostic_results')
    .update({ email, next_nurture_at: nextNurtureAt })
    .eq('id', id)

  if (error) {
    console.error('Failed to update diagnostic email:', error)
    return { success: false }
  }

  void mirrorToSubscribers(email, 'diagnostic-results')

  return { success: true }
}

// ── Draft persistence (abandon-capture / resume) ────────────────────────────
// A draft row is created the moment context questions finish, then updated
// silently on every answer, so a mid-flow drop-off is recoverable instead of
// a total loss. It's promoted to a completed row by saveDiagnosticResult()
// above once the wizard reaches the results screen.

export async function saveDraft(
  contextAnswers: Partial<ContextAnswers>,
): Promise<{ id?: string }> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
      session_id: getSessionId(),
      species: contextAnswers.species || null,
      system: contextAnswers.system || null,
      context_answers: contextAnswers,
      answers: {},
      completed: false,
    })
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Failed to save draft:', error)
    return {}
  }
  return { id: data?.id }
}

export async function updateDraftProgress(
  id: string,
  answers: DiagnosticAnswers,
  currentCategoryIndex: number,
  currentQuestionInCat: number,
): Promise<void> {
  const { error } = await supabase
    .from('diagnostic_results')
    .update({
      answers,
      current_category_index: currentCategoryIndex,
      current_question_in_cat: currentQuestionInCat,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) console.error('Failed to update draft progress:', error)
}

export async function saveDraftEmail(id: string, email: string): Promise<{ success: boolean }> {
  const { error } = await supabase.from('diagnostic_results').update({ email }).eq('id', id)
  if (error) {
    console.error('Failed to save draft email:', error)
    return { success: false }
  }
  void mirrorToSubscribers(email, 'diagnostic-resume')
  return { success: true }
}

export interface DraftRow {
  id: string
  contextAnswers: Partial<ContextAnswers>
  answers: DiagnosticAnswers
  currentCategoryIndex: number
  currentQuestionInCat: number
}

// Only readable once `email` is set on the row — matches the existing RLS
// policy (`anon read own diagnostic`), which permits SELECT when
// `email IS NOT NULL`. That's also exactly the state a resume link implies:
// the row only got here via saveDraftEmail() above.
export async function loadDraft(id: string): Promise<DraftRow | null> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('id, context_answers, answers, current_category_index, current_question_in_cat, completed')
    .eq('id', id)
    .eq('completed', false)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    contextAnswers: (data.context_answers ?? {}) as Partial<ContextAnswers>,
    answers: (data.answers ?? {}) as DiagnosticAnswers,
    currentCategoryIndex: data.current_category_index ?? 0,
    currentQuestionInCat: data.current_question_in_cat ?? 0,
  }
}

// ── Peer benchmarking ────────────────────────────────────────────────────────
// Only returns a result once a species+system segment has at least
// MIN_SEGMENT_SAMPLE completed rows — below that, comparisons would be
// statistically meaningless (or a "you're worse than 100% of 1 farm"
// absurdity). Activates itself automatically as real traffic accumulates;
// no code change needed later.

const MIN_SEGMENT_SAMPLE = 20

export interface SegmentPercentile {
  percentile: number // user is worse than this % of peers in the same species+system segment
  sampleSize: number
}

export async function getSegmentPercentile(
  species: Species,
  system: System,
  categoryId: number,
  userCategoryPct: number,
): Promise<SegmentPercentile | null> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('category_scores, category_maxes')
    .eq('species', species)
    .eq('system', system)
    .eq('completed', true)
    .limit(500)

  if (error || !data) return null

  const peerPcts = data
    .map(row => {
      const scores = row.category_scores as Record<string, number> | null
      const maxes = row.category_maxes as Record<string, number> | null
      const s = scores?.[categoryId]
      const m = maxes?.[categoryId]
      if (s == null || m == null || m === 0) return null
      return Math.round((s / m) * 100)
    })
    .filter((v): v is number => v !== null)

  if (peerPcts.length < MIN_SEGMENT_SAMPLE) return null

  const betterThanUser = peerPcts.filter(p => p < userCategoryPct).length
  const percentile = Math.round((betterThanUser / peerPcts.length) * 100)

  return { percentile, sampleSize: peerPcts.length }
}

export async function joinCourseWaitlist(
  email: string,
  courseSlug: string,
): Promise<{ success: boolean; duplicate?: boolean }> {
  const { error } = await supabase
    .from('course_waitlist')
    .insert({ email, course_slug: courseSlug })

  if (error) {
    if (error.code === '23505') {
      return { success: false, duplicate: true }
    }
    console.error('Failed to join waitlist:', error)
    return { success: false }
  }

  void mirrorToSubscribers(email, `course-waitlist-${courseSlug}`)

  return { success: true }
}

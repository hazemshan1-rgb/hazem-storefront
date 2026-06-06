import { supabase } from './supabase'
import type { ContextAnswers, DiagnosticAnswers, ScoreResult } from '../data/diagnosticData'

function getSessionId(): string {
  let id = sessionStorage.getItem('hazem-session-id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('hazem-session-id', id)
  }
  return id
}

export async function saveDiagnosticResult(
  answers: DiagnosticAnswers,
  contextAnswers: ContextAnswers,
  result: ScoreResult,
  email?: string,
): Promise<{ success: boolean; id?: string }> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .insert({
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
    })
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Failed to save diagnostic result:', error)
    return { success: false }
  }

  return { success: true, id: data?.id }
}

export async function updateDiagnosticEmail(
  id: string,
  email: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('diagnostic_results')
    .update({ email })
    .eq('id', id)

  if (error) {
    console.error('Failed to update diagnostic email:', error)
    return { success: false }
  }

  return { success: true }
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

  return { success: true }
}

export async function captureEmail(
  email: string,
  source: string,
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('email_captures')
    .insert({ email, source })

  if (error) {
    console.error('Failed to capture email:', error)
    return { success: false }
  }

  return { success: true }
}

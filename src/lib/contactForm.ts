import { supabase } from './supabase'

export interface ContactMessageInput {
  name: string
  email: string
  message: string
  // Honeypot — real visitors never see or fill this field. Any value here
  // means a bot filled every input it could find; pretend success and skip
  // both Supabase and the notification email.
  honeypot?: string
}

export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<{ success: boolean }> {
  if (input.honeypot) {
    return { success: true }
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    message: input.message,
  })

  if (error) {
    console.error('Failed to save contact message:', error)
    return { success: false }
  }

  void fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: input.name, email: input.email, message: input.message }),
  }).catch(err => console.error('Failed to send contact notification:', err))

  return { success: true }
}

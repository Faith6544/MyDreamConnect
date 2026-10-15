import { supabase } from './supabase';

/**
 * Checks if a submission is likely spam.
 * Returns { allowed: true } or { allowed: false, reason: '...' }.
 */
export async function checkSpam({ honeypot, email, formType }) {
  // Layer 1: Honeypot — if the hidden field has a value, it's a bot.
  if (honeypot && honeypot.trim() !== '') {
    return { allowed: false, reason: 'honeypot' };
  }

  // Layer 2: Rate limit — max 3 submissions per email per hour.
  if (email) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('form_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase().trim())
      .gte('submitted_at', oneHourAgo);

    if (!error && count !== null && count >= 3) {
      return { allowed: false, reason: 'rate_limit' };
    }
  }

  return { allowed: true };
}

/**
 * Log a successful submission for rate limiting.
 * Silent on failure — we don't want to block the user.
 */
export async function logSubmission({ email, formType }) {
  if (!email) return;
  await supabase
    .from('form_submissions')
    .insert([{ email: email.toLowerCase().trim(), form_type: formType }])
    .catch(() => {});
}
import { supabase } from './supabase';

const MAX_SUBMISSIONS_PER_HOUR = 3;

export async function checkSpam({ honeypot, email, formType }) {
  // Layer 1: honeypot, a hidden field that real people never fill
  if (honeypot && honeypot.trim() !== '') {
    return { allowed: false, reason: 'honeypot' };
  }

  // Layer 2: max 3 submissions per email per hour, counted inside the database
  if (email) {
    // Normalise here as well, otherwise the count query looks up a different
    // address than logSubmission() stored (which always lowercases).
    const normalized = email.trim().toLowerCase();

    const { data: count, error } = await supabase.rpc('recent_submission_count', {
      p_email: normalized,
    });

    // Fail CLOSED: if the rate limiter itself is broken we must not silently
    // become an open relay for spam.
    if (error) {
      console.error('Rate-limit check failed:', error);
      return { allowed: false, reason: 'rate_limit_unavailable' };
    }

    if (typeof count !== 'number') {
      console.error('Rate-limit check returned no count:', count);
      return { allowed: false, reason: 'rate_limit_unavailable' };
    }

    if (count >= MAX_SUBMISSIONS_PER_HOUR) {
      return { allowed: false, reason: 'rate_limit' };
    }
  }

  return { allowed: true };
}

export async function logSubmission({ email, formType }) {
  if (!email) return;

  // supabase-js resolves with { error } instead of throwing, so the error HAS
  // to be inspected - otherwise a rejected insert silently stops the counter
  // from ever incrementing and the rate limit never triggers.
  try {
    const { error } = await supabase
      .from('form_submissions')
      .insert([{ email: email.toLowerCase().trim(), form_type: formType }]);

    if (error) {
      console.error('Could not log submission:', error); // never block the visitor because of logging
    }
  } catch (err) {
    console.error('Could not log submission:', err);
  }
}

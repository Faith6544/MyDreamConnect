import { supabase } from './supabase';

export async function checkSpam({ honeypot, email, formType }) {
  // Layer 1: honeypot, a hidden field that real people never fill
  if (honeypot && honeypot.trim() !== '') {
    return { allowed: false, reason: 'honeypot' };
  }

  // Layer 2: max 3 submissions per email per hour, counted inside the database
  if (email) {
    const { data: count, error } = await supabase.rpc('recent_submission_count', {
      p_email: email,
    });

    if (!error && typeof count === 'number' && count >= 3) {
      return { allowed: false, reason: 'rate_limit' };
    }
  }

  return { allowed: true };
}

export async function logSubmission({ email, formType }) {
  if (!email) return;
  try {
    await supabase
      .from('form_submissions')
      .insert([{ email: email.toLowerCase().trim(), form_type: formType }]);
  } catch (err) {
    console.error('Could not log submission:', err); // never block the visitor because of logging
  }
}
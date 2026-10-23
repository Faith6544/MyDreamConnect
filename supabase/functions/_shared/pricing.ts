/**
 * Shared helpers for the payment / scholarship edge functions.
 *
 * All pricing decisions are made HERE, on the server, from the database.
 * The client is never trusted with an amount: a user could otherwise pay
 * any price they like (including 0) for any course.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/** An approved scholarship applicant pays 20% (i.e. 80% off). */
export const SCHOLARSHIP_RATE = 0.2

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/** Naira -> integer kobo. Never use a raw float multiply; Paystack rejects fractions. */
export function toKobo(naira: number): number {
  return Math.round(Number(naira) * 100)
}

/** Apply the scholarship discount, rounded to 2 decimal places (kobo precision). */
export function applyScholarship(price: number): number {
  return Math.round(Number(price) * SCHOLARSHIP_RATE * 100) / 100
}

/** Service-role client. Used for reads the visitor is not allowed to make directly. */
export function adminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
}

/**
 * Resolve the caller's user from the Bearer token.
 * Returns null when the token is missing or invalid.
 */
export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return null

  const { data, error } = await adminClient().auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export async function getCoursePrice(courseId: number): Promise<number> {
  const { data, error } = await adminClient()
    .from('courses')
    .select('id, price')
    .eq('id', courseId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Course not found')

  return Number(data.price ?? 0)
}

/**
 * True when this email has an APPROVED scholarship application for the course.
 * Matching on the account email means the magic link only works for the
 * person it was issued to.
 */
export async function hasApprovedScholarship(
  courseId: number,
  email: string
): Promise<boolean> {
  const { data, error } = await adminClient()
    .from('scholarship_applications')
    .select('id')
    .eq('course_id', courseId)
    .eq('email', email)
    .eq('status', 'approved')
    .limit(1)

  if (error) throw new Error(error.message)
  return (data || []).length > 0
}

/**
 * The authoritative price for a checkout.
 * `price` is the list price, `amount` is what the customer actually pays.
 */
export async function resolvePrice(
  courseId: number,
  email: string
): Promise<{ price: number; amount: number; eligible: boolean }> {
  const price = await getCoursePrice(courseId)
  const eligible = price > 0 && (await hasApprovedScholarship(courseId, email))
  const amount = eligible ? applyScholarship(price) : price

  return { price, amount, eligible }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

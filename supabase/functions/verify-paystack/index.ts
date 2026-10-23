// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {
  adminClient,
  corsHeaders,
  getAuthenticatedUser,
  jsonResponse,
  resolvePrice,
  toKobo,
} from "../_shared/pricing.ts"

/**
 * Verifies a completed Paystack payment and grants the enrollment.
 *
 * SECURITY: the amount actually charged is compared against the amount the
 * server expects. Without this check a user could initialise a transaction
 * for a trivial amount, pay it, and be granted a course worth far more.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) throw new Error('You must be signed in to complete a payment.')

    const { reference, course_id } = await req.json()
    const courseId = Number(course_id)
    if (!reference) throw new Error('A payment reference is required')
    if (!courseId) throw new Error('A course_id is required')

    // 1. Verify the payment with Paystack
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!PAYSTACK_SECRET_KEY) throw new Error('Payment service is not configured')

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || paystackData.data.status !== 'success') {
      throw new Error('Payment verification failed')
    }

    // 2. The payment must have been made by this user, for this course.
    if (
      paystackData.data.email &&
      paystackData.data.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      throw new Error('This payment was made with a different account')
    }

    const metadataCourseId = Number(paystackData.data.metadata?.course_id)
    if (metadataCourseId && metadataCourseId !== courseId) {
      throw new Error('This payment is for a different course')
    }

    // 3. The amount charged must match what the server expects.
    const { amount } = await resolvePrice(courseId, user.email)
    const expectedKobo = toKobo(amount)
    if (Number(paystackData.data.amount) !== expectedKobo) {
      throw new Error(
        `Payment amount does not match the course price (expected ${expectedKobo} kobo, got ${paystackData.data.amount} kobo)`
      )
    }

    // 4. The payment is real and correct - save the enrollment.
    const supabaseClient = adminClient()

    const { error } = await supabaseClient.from('enrollments').insert([
      {
        user_id: user.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
      },
    ])

    // 23505 = unique_violation: already enrolled, which is fine.
    if (error && error.code !== '23505') {
      throw error
    }

    return jsonResponse({ success: true })

  } catch (error) {
    return jsonResponse({ error: error.message }, 400)
  }
})

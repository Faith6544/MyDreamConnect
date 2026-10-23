// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {
  corsHeaders,
  getAuthenticatedUser,
  jsonResponse,
  resolvePrice,
  toKobo,
} from "../_shared/pricing.ts"

/**
 * Starts a Paystack transaction for a course.
 *
 * SECURITY: the amount is NEVER taken from the request body. It is looked up
 * from the `courses` table and the scholarship discount is applied based on
 * an approved `scholarship_applications` row. A tampered client cannot pay
 * less than the server decides.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // The request must be made by a signed-in user so the scholarship can be
    // matched against their account.
    const user = await getAuthenticatedUser(req)
    if (!user) throw new Error('You must be signed in to pay for a course.')

    const { course_id, callback_url } = await req.json()
    const courseId = Number(course_id)
    if (!courseId) throw new Error('A course_id is required')

    const { price, amount, eligible } = await resolvePrice(courseId, user.email)

    if (price <= 0) throw new Error('This course is free - enroll without payment.')

    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!PAYSTACK_SECRET_KEY) throw new Error('Payment service is not configured')

    const amountKobo = toKobo(amount)

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountKobo, // Naira -> Kobo
        callback_url,
        metadata: { course_id: courseId, scholarship: eligible },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || 'Failed to initialize payment')
    }

    return jsonResponse({
      authorization_url: data.data.authorization_url,
      amount: amount,
      price: price,
      scholarship_applied: eligible,
    })

  } catch (error) {
    return jsonResponse({ error: error.message }, 400)
  }
})

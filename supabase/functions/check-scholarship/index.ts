// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {
  corsHeaders,
  getAuthenticatedUser,
  jsonResponse,
  resolvePrice,
} from "../_shared/pricing.ts"

/**
 * Tells the signed-in visitor what they actually have to pay for a course.
 *
 * The frontend uses this to display the right price. The scholarship is only
 * granted when this account's email has an APPROVED scholarship application
 * for this course, so appending `?scholarship=approved_80` to a URL does
 * nothing on its own.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getAuthenticatedUser(req)
    if (!user) throw new Error('You must be signed in to check a scholarship.')

    const { course_id } = await req.json()
    const courseId = Number(course_id)
    if (!courseId) throw new Error('A course_id is required')

    const { price, amount, eligible } = await resolvePrice(courseId, user.email)

    return jsonResponse({
      eligible,
      price,
      amount,
      currency: 'NGN',
    })

  } catch (error) {
    return jsonResponse({ error: error.message }, 400)
  }
})

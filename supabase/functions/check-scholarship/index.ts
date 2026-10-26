// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { course_id } = await req.json()

    // 1. Get the user making the request
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Not logged in')

    // 2. Get the course price
    const { data: course } = await supabaseClient
      .from('courses')
      .select('price')
      .eq('id', course_id)
      .single()

    if (!course) throw new Error('Course not found')

    // 3. Check if they have an approved scholarship for THIS course
    // We check by user_id OR email to catch both new and old applications
    const { data: scholarship } = await supabaseClient
      .from('scholarship_applications')
      .select('id')
      .eq('course_id', course_id)
      .eq('status', 'approved')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle()

    const eligible = !!scholarship
    const amount = eligible ? course.price * 0.2 : course.price

    return new Response(
      JSON.stringify({ 
        price: course.price, 
        amount: amount, 
        eligible: eligible 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
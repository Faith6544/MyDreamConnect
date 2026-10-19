// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Manually defining CORS headers is the most bulletproof way to stop browser errors
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const model = new Supabase.ai.Session('gte-small')

Deno.serve(async (req) => {
  // Handle the CORS preflight check
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      return new Response(JSON.stringify({ error: "No text" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const embedding = await model.run(text, { mean_pool: true, normalize: true })

    return new Response(JSON.stringify({ embedding }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_TEXT_LENGTH = 8000

const model = new Supabase.ai.Session('gte-small')

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const text = (payload as { text?: unknown })?.text

  // Validate the type: a number/object would make model.run throw a 500.
  if (typeof text !== 'string' || text.trim().length === 0) {
    return json({ error: 'No text' }, 400)
  }

  // Cap the input so a single request cannot burn the whole AI quota.
  if (text.length > MAX_TEXT_LENGTH) {
    return json({ error: `Text too long (max ${MAX_TEXT_LENGTH} characters)` }, 413)
  }

  try {
    const embedding = await model.run(text, { mean_pool: true, normalize: true })

    return json({ embedding })
  } catch (error) {
    console.error('Embedding generation failed:', error)
    return json({ error: 'Embedding generation failed' }, 500)
  }
})

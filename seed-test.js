const { supabase, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('./scripts/admin-client');

async function testSearch() {
  const query = "dream"; // We know "dream" is in the About Us text
  console.log(`Testing search for: "${query}"`);

  try {
    // 1. Get the embedding from your Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ text: query })
    });

    const data = await response.json();
    console.log("Edge Function returned:", data);

    if (!data.embedding) {
      console.log("❌ No embedding returned!");
      return;
    }

    // 2. Call the match_documents RPC
    console.log("Calling match_documents RPC...");
    const { data: results, error } = await supabase.rpc('match_documents', {
      query_embedding: data.embedding,
      match_threshold: 0.1, 
      match_count: 10
    });

    if (error) {
      console.log("❌ Database RPC Error:", error);
    } else {
      console.log("✅ Database RPC Results:", results);
    }
  } catch (err) {
    console.error("❌ Network/Script Error:", err);
  }
}

testSearch();
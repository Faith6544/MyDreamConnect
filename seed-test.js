const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kzdqbqnyytgovlngfvwr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZHFicW55eXRnb3ZsbmdmdndyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDk1MzkwNiwiZXhwIjoyMTA2NTI5OTA2fQ.vLfAoKUK6UiZqXdWie1k75VtcLPR_0ZIf1xMzRi5Tkw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testSearch() {
  const query = "dream"; // We know "dream" is in the About Us text
  console.log(`Testing search for: "${query}"`);

  try {
    // 1. Get the embedding from your Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
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
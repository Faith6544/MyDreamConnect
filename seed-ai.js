const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kzdqbqnyytgovlngfvwr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZHFicW55eXRnb3ZsbmdmdndyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDk1MzkwNiwiZXhwIjoyMTA2NTI5OTA2fQ.vLfAoKUK6UiZqXdWie1k75VtcLPR_0ZIf1xMzRi5Tkw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seed() {
  console.log("Fetching data from database...");
  
  const { data: posts } = await supabase.from('posts').select('id, title, content');
  const { data: courses } = await supabase.from('courses').select('id, name, excerpt');
  const { data: jobs } = await supabase.from('jobs').select('id, title, description');

  const allContent = [
    ...(posts || []).map(p => ({ text: `Blog Post: ${p.title}. ${p.content || ''}`, url: `/blog/${p.id}` })),
    ...(courses || []).map(c => ({ text: `Course: ${c.name}. ${c.excerpt || ''}`, url: `/courses/${c.id}` })),
    ...(jobs || []).map(j => ({ text: `Job: ${j.title}. ${j.description || ''}`, url: `/jobs/${j.id}` })),
    { text: `Page: Home. Welcome to MyDreamConnect. We empower youths and women.`, url: `/` },
    { text: `Page: About Us. Learn about our mission and vision for Nigeria.`, url: `/about` },
    { text: `Page: Contact. Get in touch with the MyDreamConnect team.`, url: `/contact` },
    { text: `Page: Donate. Support our mission and help us raise leaders.`, url: `/donate` },
    { text: `Page: Partnership. Partner with us to build the future.`, url: `/partnership` }
  ];

  console.log(`Generating AI embeddings for ${allContent.length} items...`);

  for (const item of allContent) {
    try {
      // Call YOUR Supabase Edge Function (Free)
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ text: item.text })
      });

      const { embedding, error } = await response.json();

      if (error || !embedding) {
        console.error(`❌ Failed for: ${item.text.substring(0, 20)}`, error);
        continue;
      }

      // Save to database
      const { error: dbError } = await supabase.from('documents').insert({
        content: item.text,
        embedding: embedding
      });

      if (dbError) console.error("❌ DB Error:", dbError);
      else console.log(`✅ Added: ${item.text.substring(0, 40)}...`);
      
    } catch (err) {
      console.error(`❌ Network error for: ${item.text.substring(0, 20)}`, err);
    }
  }
  
  console.log("🎉 Done! Your table is now populated with free AI embeddings.");
}

seed();
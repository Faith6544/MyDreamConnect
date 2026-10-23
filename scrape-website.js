const puppeteer = require('puppeteer');
const { supabase, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('./scripts/admin-client');

const pagesToScrape = [
  { url: 'http://localhost:3000/', title: 'Home' },
  { url: 'http://localhost:3000/about', title: 'About Us' },
  { url: 'http://localhost:3000/contact', title: 'Contact' },
  { url: 'http://localhost:3000/donate', title: 'Donate' },
  { url: 'http://localhost:3000/partnership', title: 'Partnership' },
  { url: 'http://localhost:3000/courses', title: 'All Courses' },
  { url: 'http://localhost:3000/talent/jobs', title: 'Jobs' }
];

async function scrapeAndSeed() {
  console.log("Starting browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("Clearing old data...");
  await supabase.from('documents').delete().neq('id', 0); 

  for (const pageInfo of pagesToScrape) {
    try {
      console.log(`🔍 Scraping: ${pageInfo.title}`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle0', timeout: 30000 });

      const pageText = await page.evaluate(() => {
        document.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
        return document.body.innerText.replace(/\s+/g, ' ').trim();
      });

      if (pageText.length < 50) continue;

      const chunks = pageText.match(/.{1,1000}(\s|$)/g) || [pageText];

      for (const chunk of chunks) {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ text: chunk })
        });

        const data = await response.json();

        if (!data.embedding) {
            console.error("AI Failed:", data);
            continue;
        }

        const { error: dbError } = await supabase.from('documents').insert({
          content: chunk,
          url: pageInfo.url.replace('http://localhost:3000', ''),
          title: pageInfo.title,
          embedding: data.embedding
        });

        if (dbError) console.error("DB Error:", dbError.message);
        else console.log(`✅ Saved chunk for ${pageInfo.title}`);
      }
    } catch (err) {
      console.error(`❌ Scraping Error:`, err.message);
    }
  }
  await browser.close();
  console.log("🎉 Done! Check your Supabase table.");
}
scrapeAndSeed();
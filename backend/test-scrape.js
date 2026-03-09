const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('google.html', 'utf-8');
const $ = cheerio.load(html);

const leads = [];

$('[role="article"]').each((_, el) => {
  const card = $(el);
  const name =
    card.find('.qBF1Pd').text().trim() ||
    card.attr('aria-label')?.trim() ||
    null;

  if (name) {
    leads.push({ name });
  }
});

console.log(`Found ${leads.length} leads:`, leads);

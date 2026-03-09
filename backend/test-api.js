const fs = require('fs');

async function test() {
  const html = fs.readFileSync('google.html', 'utf-8');
  console.log('HTML size:', html.length);
  
  const response = await fetch("http://localhost:3000/scraper/scrape-html", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ html, location: 'Test Location' }),
  });

  console.log('Status code:', response.status);
  
  // The response is a blob (Excel file)
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync('test_output.xlsx', Buffer.from(arrayBuffer));
  console.log('Excel saved, size:', arrayBuffer.byteLength);
}

test().catch(console.error);

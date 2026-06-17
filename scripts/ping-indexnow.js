const http = require('https');

const host = 'www.numeraise.com';
const key = '45fbe24f80164c67909b0bcfda5c065f';
const keyLocation = `https://${host}/${key}.txt`;

// Fetch the sitemap to get all URLs
console.log('Fetching sitemap.xml to extract URLs...');
http.get(`https://${host}/sitemap.xml`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      // Simple regex to extract all <loc>URLs</loc> from sitemap xml
      const urlRegex = /<loc>(https:\/\/www\.numeraise\.com[^<]+)<\/loc>/g;
      const urlList = [];
      let match;
      while ((match = urlRegex.exec(data)) !== null) {
        urlList.push(match[1]);
      }

      if (urlList.length === 0) {
        console.log('No URLs found in sitemap or site is not live yet.');
        return;
      }

      console.log(`Found ${urlList.length} URLs. Sending to IndexNow...`);

      const postData = JSON.stringify({
        host: host,
        key: key,
        keyLocation: keyLocation,
        urlList: urlList
      });

      const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (response) => {
        console.log(`IndexNow response status: ${response.statusCode}`);
        response.on('data', (d) => {
          process.stdout.write(d);
        });
      });

      req.on('error', (error) => {
        console.error('IndexNow Request Error:', error);
      });

      req.write(postData);
      req.end();
    } catch (err) {
      console.error('Failed to parse sitemap:', err);
    }
  });
}).on('error', (err) => {
  console.error('Failed to fetch sitemap:', err.message);
});

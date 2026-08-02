/**
 * Submits every sitemap URL to IndexNow after a successful build.
 *
 * IndexNow is the only push channel Bing offers, and it matters most for a new
 * domain that Bing has not discovered organically. This runs from `postbuild`,
 * so it only fires on deploy -- if you go a month without deploying, Bing hears
 * nothing. Deploy at least fortnightly while the site is establishing itself.
 *
 * Fixes over the previous version:
 *  - Never fails the build. A non-zero exit here previously risked breaking a
 *    deploy over a search-engine ping, which is the wrong trade.
 *  - Follows redirects (the old version silently got 0 URLs if the sitemap
 *    responded with a 301).
 *  - Batches submissions; IndexNow caps a payload at 10,000 URLs.
 *  - Derives the host from NEXT_PUBLIC_APP_URL instead of hardcoding it, so the
 *    key location always matches the host being submitted. A mismatch is
 *    rejected with 422.
 */

const https = require('https');

const KEY = '6c98221010aa4f528461be99d29dadde';
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://numeraise.com').replace(/\/$/, '');
const HOST = new URL(SITE_URL).host;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const BATCH_SIZE = 5000;

/** Never let this script fail a deploy. */
function bail(message) {
  console.log(`[indexnow] skipped: ${message}`);
  process.exit(0);
}

function get(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'numeraise-indexnow/1.0' } }, (res) => {
        const { statusCode, headers } = res;

        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          res.resume();
          if (redirectsLeft === 0) return reject(new Error('too many redirects'));
          const next = new URL(headers.location, url).toString();
          return resolve(get(next, redirectsLeft - 1));
        }

        if (statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${statusCode} for ${url}`));
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function submit(urlList) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });

    const req = https.request(
      {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          // 200 accepted, 202 accepted pending key validation.
          const ok = res.statusCode === 200 || res.statusCode === 202;
          console.log(
            `[indexnow] ${urlList.length} URLs -> HTTP ${res.statusCode}${ok ? ' (accepted)' : ` ${body.trim()}`}`,
          );
          resolve(ok);
        });
      },
    );

    req.on('error', (err) => {
      console.log(`[indexnow] request failed: ${err.message}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`[indexnow] host=${HOST}`);

  let xml;
  try {
    xml = await get(`${SITE_URL}/sitemap.xml`);
  } catch (err) {
    // Expected on a first deploy: the sitemap is not live until this build ships.
    return bail(`could not fetch sitemap (${err.message})`);
  }

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => {
      try {
        return new URL(u).host === HOST;
      } catch {
        return false;
      }
    });

  if (urls.length === 0) return bail('no matching URLs found in sitemap');

  console.log(`[indexnow] submitting ${urls.length} URLs`);

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    await submit(urls.slice(i, i + BATCH_SIZE));
  }
}

main().catch((err) => bail(err.message));

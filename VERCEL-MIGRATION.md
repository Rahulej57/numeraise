# Migrating numeraise.com from Netlify to Vercel

Vercel is a sound choice here — it's the Next.js vendor, so you get the native
runtime instead of the `@netlify/plugin-nextjs` compatibility layer, and no
deploy-credit ceiling. But the SEO work that shipped today is partly
Netlify-specific, and a careless cutover will silently undo it.

Read this whole file before changing DNS. The risky step is last, deliberately.

---

## What breaks, and what replaces it

| Netlify thing | Status on Vercel | Replacement |
|---|---|---|
| `netlify.toml` build config | ignored | `vercel.json` (added) |
| `netlify.toml` security headers | ignored | `vercel.json` → `headers` (added) |
| `netlify.toml` `X-Robots-Tag` on preview contexts | ignored | now handled in code — `src/config/deployment.ts` |
| `netlify.toml` 301 from `*.netlify.app` | ignored | Vercel domain settings, see step 5 |
| `public/_headers` | **ignored entirely** | `vercel.json` → `headers` |
| `@netlify/plugin-nextjs` | unnecessary | remove from `devDependencies` |
| `NEXT_PUBLIC_APP_URL` env var | not carried over | set it in Vercel, step 2 |
| `next.config.ts` redirects | **works unchanged** | nothing to do |
| `postbuild` IndexNow ping | **works unchanged** | nothing to do |

Note that `public/_headers` is silently ignored on Vercel — no warning, no
error. That is exactly how the original bug happened on Netlify: a headers file
in a syntax the host doesn't parse looks like it's working right up until you
check the response headers. Don't rely on it.

---

## Preview indexing is now handled in code

This is the one thing worth understanding rather than just copying.

On Netlify, `venerable-sherbet-10d546.netlify.app` served a fully crawlable copy
of the entire production site: `robots.txt` said `Allow: /`, no `X-Robots-Tag`
was set, and the rule intended to prevent it targeted `https://*.pages.dev/*` —
Cloudflare Pages syntax that Netlify ignores.

Rather than trust any host's defaults, `src/config/deployment.ts` now decides:

- Reads `VERCEL_ENV` (Vercel), falls back to `CONTEXT` (Netlify), and defaults
  to **not production** when neither is present.
- `src/app/robots.ts` returns `Disallow: /` on any non-production deployment.
- The root layout emits `noindex, nofollow` on any non-production deployment.

So `*.vercel.app` preview URLs cannot be indexed regardless of Vercel's
settings. This survives a future host change too.

---

## Migration steps

### 1. Import the repo

Vercel dashboard → **Add New → Project** → import `Rahulej57/numeraise`.
It will auto-detect Next.js. Leave build settings alone; `vercel.json` covers it.

**Do not add the custom domain yet.** Deploy to the generated `.vercel.app` URL
first and confirm the site works there.

### 2. Set the environment variable

Project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_APP_URL = https://numeraise.com
```

Scope it to **Production only**. Leave it unset for Preview — that is what makes
`isProductionDeployment()` return false on previews and keeps them out of the
index.

No trailing slash, no `www`. Every canonical, sitemap entry and JSON-LD `@id`
derives from this value.

### 3. Verify on the .vercel.app URL before touching DNS

```bash
curl -s https://<your-project>.vercel.app/robots.txt
```

You want `Disallow: /` — proving the preview guard works. Then spot-check that
pages render and the build succeeded.

### 4. Add the domains

Project → **Settings → Domains** → add **both**:

- `numeraise.com`
- `www.numeraise.com`

Vercel will show you the exact DNS records to create. **Use the values Vercel
shows you**, not values from a blog post — the apex IP has changed historically
and a stale one means downtime.

Set `www.numeraise.com` to **Redirect to** `numeraise.com` (308). This preserves
your current behaviour: apex is canonical, www redirects to it. Getting this
backwards would invalidate every canonical on the site.

### 5. Kill the .vercel.app duplicate

Vercel serves your production deployment on its generated domain too. Two
options, in order of preference:

1. Project → **Settings → Deployment Protection → Vercel Authentication**, scoped
   to preview deployments. Cleanest.
2. Add the `.vercel.app` domain to the project and set it to **Redirect to**
   `numeraise.com`.

The `robots.ts` guard already prevents preview URLs being crawled, so this is
defence in depth for the production generated URL specifically.

### 6. Update DNS at Wix

Your nameservers are `ns4.wixdns.net` / `ns5.wixdns.net` — Wix is authoritative.
Netlify's dashboard claims "Netlify DNS" but nothing is delegated to it, so
**edit records at Wix**, not Netlify.

Change only these two:

| Type | Host | Old (Netlify) | New |
|---|---|---|---|
| A | `numeraise.com` | `75.2.60.5` | *value Vercel shows* |
| CNAME | `www.numeraise.com` | `venerable-sherbet-10d546.netlify.app` | *value Vercel shows* |

**Leave everything else alone.** Specifically do not touch:

- `MX` → `mx1.improvmx.com`, `mx2.improvmx.com` (your email breaks otherwise)
- `TXT` → `v=spf1 include:spf.improvmx.com ~all`
- `TXT` → `google-site-verification=Pje6t2yMMFkQMCyzpaRyzeQ-Y8LS2LJhSVauNtPLBTg`
  (removing this de-verifies Search Console)
- `TXT` → `brevo-code:...`
- `TXT` → `_dmarc.numeraise.com`
- `CNAME` → `brevo1._domainkey`, `brevo2._domainkey` (DKIM)

TTL is 1 hour, so allow up to an hour for propagation. Vercel issues the TLS
certificate automatically once DNS resolves.

### 7. Post-cutover verification

Run all of these. Every one should match:

```bash
curl -sI https://numeraise.com/ | head -1
```
→ `HTTP/2 200`

```bash
curl -sI https://www.numeraise.com/ | grep -i location
```
→ `location: https://numeraise.com/`

```bash
curl -s https://numeraise.com/robots.txt
```
→ `Allow: /` plus `Sitemap: https://numeraise.com/sitemap.xml`

```bash
curl -s https://numeraise.com/sitemap.xml | grep -c "<loc>"
```
→ `127`

```bash
curl -s https://numeraise.com/calculators/sip-calculator | grep -o 'rel="canonical" href="[^"]*"'
```
→ `rel="canonical" href="https://numeraise.com/calculators/sip-calculator"`

```bash
curl -sI https://numeraise.com/calculators/life-insurance-calculator | head -1
```
→ `HTTP/2 308` (the duplicate-content redirect still works)

### 8. Do NOT delete the Netlify files — corrected advice

An earlier version of this file said to delete `netlify.toml`, `public/_headers`
and `@netlify/plugin-nextjs` once Vercel was verified. That was wrong, and the
reason is worth understanding.

`venerable-sherbet-10d546.netlify.app` is still live and currently returns
**301 → https://numeraise.com/**. That redirect exists *because* of the
host-scoped rule in `netlify.toml`. Delete the file and let Netlify rebuild, and
the redirect disappears — the Netlify subdomain would start serving a full,
crawlable duplicate of the site again, which is the exact bug this whole
exercise started with.

So the Netlify config is not dead weight. It is what keeps that hostname
pointing home.

**Recommended: keep the Netlify site, stop it rebuilding.**

Netlify → Site configuration → Build & deploy → **Lock to stop auto publishing**.

That freezes the current deploy, so the 301 keeps working forever, and future
pushes to `master` no longer consume Netlify build minutes. You get the redirect
without the cost. Leave `netlify.toml`, `public/_headers` and the plugin in the
repo — they are inert on Vercel and load-bearing on Netlify.

**If you would rather delete the Netlify site entirely:** that is also fine. The
subdomain then stops resolving instead of redirecting. Slightly worse, because a
301 consolidates any signal Google attached to those URLs and a dead host does
not, but the difference is small. Only after the site is deleted is it safe to
remove the three Netlify artefacts from the repo.

**Check this either way:** if the Netlify site is still connected to the GitHub
repo with auto-publish on, every push to `master` triggers a Netlify build as
well as a Vercel one — quietly burning the deploy credits you moved away from
Netlify to escape.

---

## SEO risk during cutover

Low, if you follow the order above. Specifically:

- **Don't change DNS before the Vercel deploy is verified.** A cutover to a
  broken deploy means Googlebot hits errors on 127 URLs.
- **Don't let both hosts serve the domain.** Finish the DNS change in one pass.
- **The www→apex direction must not flip.** Every canonical on the site points
  at the apex. If www became canonical, all 127 canonicals would point at a
  redirecting host.
- **Expect a short crawl-rate dip.** Normal after an IP change; recovers in days.

Nothing here requires re-submitting sitemaps or re-verifying Search Console,
because the domain and the DNS TXT verification record are unchanged.

---

## What does not change

Your Google Search Console property, Bing Webmaster Tools property, the
sitemap URL, the IndexNow key file, `ads.txt`, AdSense, and all 127 canonical
URLs. The host is an implementation detail below the domain — which is exactly
why this migration is safe to do.

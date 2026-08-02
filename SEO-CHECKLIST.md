# Numeraise SEO: what was fixed, and what you must do

Baseline measured 2 Aug 2026 against the live site.

Domain registered **8 June 2026** (Verisign RDAP). Last deploy before this work:
**5 July 2026**. So the site is ~8 weeks old and had been static for 4 weeks.

---

## Part 1 — Fixed in code

| # | Problem | Fix |
|---|---------|-----|
| 1 | `robots.ts` defaulted to **www**, `sitemap.ts` and `metadataBase` to **non-www**, all JSON-LD and `og:url` hardcoded **www** | `src/config/site.ts` is now the only place the domain appears. 45 files rewritten to use it. |
| 2 | 15 glossary + 3 compare pages shipped the **root layout's title and description** with **no canonical** | `generateMetadata` added to both dynamic routes. Every page now has a unique title, description and canonical. |
| 3 | Those same 18 pages were **orphans** — zero internal links anywhere | `/glossary` now links each term to its detail page (union of both glossary datasets). `/compare` was a redirect stub; it is now a real hub linking all three comparisons, and is in the footer. |
| 4 | 11 category pages, `/glossary`, `/privacy`, `/terms`, `/disclaimer`, `/accessibility`, `/cookie-policy`, `/contact` had **no canonical** | All added. |
| 5 | 10 live pages **missing from sitemap.xml** | Added, plus `/compare`, `/compare/*` and the new author page. |
| 6 | `lastmod` used `new Date()` — 104 of 116 URLs shared one build timestamp | Now a stable `CONTENT_REVISION_DATE`; blog posts use real frontmatter dates. |
| 7 | **69 of 74** calculators shared one generated meta description | `src/config/calculator-seo.ts` — hand-written title, description and keywords for all 73. |
| 8 | `bmr-calculator` appeared **twice in the live sitemap** (BMR + TDEE entries, same href) | Merged into one entry; sitemap de-duplicates defensively. |
| 9 | `/calculators/life-insurance-calculator` re-exported the term-insurance component — **two URLs, identical bytes** | 301 redirect to `/calculators/term-insurance-calculator`. |
| 10 | `/calculators/life-insurance-calculator` was also **absent from the config** — orphan, not linked, not in sitemap | Resolved by the redirect above. |
| 11 | Netlify preview domain served a **fully crawlable duplicate** (`_headers` used Cloudflare `*.pages.dev` syntax Netlify ignores) | `netlify.toml` now sets `X-Robots-Tag: noindex` on deploy-preview and branch contexts. `_headers` rewritten with valid syntax + security headers. |
| 12 | `/about` claimed **"millions trust our calculators"** on a 55-day-old site | Rewritten: honest launch date, named maintainer, editorial standards, funding disclosure, YMYL disclaimer. |
| 13 | No author entity; blog bylines were bare strings | `/authors/[slug]` with `Person` schema; bylines link to it; `Article.author` references it by `@id`. |
| 14 | Organization schema had only name/url/logo | Added `sameAs` (your real FB/IG/X profiles), `contactPoint`, `foundingDate`, `SearchAction`. |
| 15 | FAQ schema emitted **duplicate questions** (e.g. "What is hyperinflation?" twice on the inflation page) | De-duplicated; empty answers dropped. |
| 16 | **36 calculators showed FAQs on-page but emitted no FAQ schema at all** — only 11 hand-written pages had it | `FAQAccordion` now emits `FAQPage` JSON-LD itself. Verified: **73 of 73** calculator pages emit valid schema, 0 duplicate blocks, 0 duplicate questions. |
| 17 | `/admin` indexable if ever linked | `noindex, nofollow`. |
| 18 | IndexNow script would silently do nothing on a redirect and could fail a build | Rewritten: follows redirects, batches, derives host from env, never fails the deploy. Verified returning HTTP 200. |
| 19 | Category pages were bare link grids (thin doorway pattern) | `src/config/category-copy.ts` — 150-250 words of unique copy per hub (loans hub measured at 330 words). |
| 20 | Thin calculator content | Structured content system + 3 pages rewritten. **See Part 3.** |

### Verified after rebuild

```
tsc --noEmit                 exit 0
npm run build                exit 0, all routes prerender
sitemap URLs                 127 (was 116), 0 duplicates, 0 www
pages missing canonical      0   (was 18+)
duplicate <title> groups     0   (was 18 pages sharing one)
duplicate descriptions       0   (was 69 pages sharing one)
calculator FAQ schema        73/73 valid
```

Measured word counts on the three rewritten pages (visible text, chrome excluded):

| Page | Before | After |
|------|--------|-------|
| `epf-calculator` | ~85 words of prose | **846** |
| `break-even-calculator` | ~85 | **734** |
| `rental-yield` | ~106 | **811** |

---

## Part 2 — What only you can do

These are the highest-impact items on the whole list. Nothing in Part 1 matters
without them.

### 1. ~~Set the Netlify environment variable~~ — ALREADY DONE

`NEXT_PUBLIC_APP_URL` is already set to `https://numeraise.com`. Confirmed
because live `robots.txt` emits the non-www sitemap URL, which is only possible
if the env var overrides the code default. Nothing to do.

### 2. Deploy

Repo is `github.com/Rahulej57/numeraise`, branch `master`, auto-publish on. The
live build is from **5 July**. Push and it deploys itself:

```bash
git add -A && git commit -m "fix(seo): canonicals, metadata, orphan pages, duplicate URLs" && git push origin master
```

The `postbuild` IndexNow ping fires automatically (verified: HTTP 200 accepted).

### 3. Bing Webmaster Tools — this is why Bing has nothing

`BingSiteAuth.xml` returns 404 and there is no Bing DNS record. A June 17 deploy
configured the IndexNow key, but the site itself was never registered in Bing
Webmaster Tools — IndexNow pings for a domain Bing has no other signals about
are largely ignored.

**Do NOT use DNS verification.** See the warning below.

1. https://www.bing.com/webmasters
2. **Import from Google Search Console** — fastest, GSC is already verified, and
   it sidesteps the DNS problem entirely
3. Submit `https://numeraise.com/sitemap.xml`
4. **URL Inspection → Request Indexing** on your 10 best pages

Expect first Bing results in 1–3 weeks.

### 3a. WARNING: Netlify's DNS panel is a dead end

Netlify's Domain Management shows "✓ Netlify DNS" next to both domains. That is
misleading. The actual authoritative nameservers are:

```
numeraise.com NS →  ns4.wixdns.net
                    ns5.wixdns.net
```

A Netlify DNS zone exists but Wix was never delegated to it. Your A record and
`www` CNAME live at **Wix**, which is why the site resolves correctly — but
**any DNS record added in Netlify's panel does nothing.**

So: add DNS records at **Wix**, not Netlify. Or delegate properly by pointing
Wix's nameservers at Netlify — but that migrates your SPF/ImprovMX mail records
too, so only do it deliberately and copy every existing record first.

Current TXT records (all at Wix): `google-site-verification`, `brevo-code`,
`v=spf1 include:spf.improvmx.com`.

### 4. Fill in the author profile — `src/config/authors.ts`

Currently contains `PLACEHOLDER` text and `needsReview: true`.

**Read the comment at the top of that file before editing.** Specifically: your
blog posts are bylined "Rahul Sharma, CFA". Only keep the CFA designation if the
charter is genuinely held and current. The CFA Institute enforces designation
use, and an unverifiable professional credential on a financial site is the kind
of trust signal that gets a YMYL domain suppressed rather than promoted. If it
is not held, remove it here **and** from the `author:` line in every file under
`src/content/blog/`.

Add a LinkedIn URL to `sameAs` — highest-value single entry on the page.

### 5. Get backlinks — the actual bottleneck

Zero sites link to numeraise.com. This is why Google crawls you rarely and Bing
not at all. Everything else is preparation for this.

Realistic starting points: Product Hunt, Indie Hackers, relevant subreddits
(read each one's self-promotion rules first), free-tools directories, your own
social profiles. Five real links beat five hundred purchased ones — paid link
networks are a manual-action risk, not a shortcut.

### 6. ~~Lock down the Netlify subdomain~~ — FIXED IN CODE

`netlify.toml` now carries a host-scoped 301 from
`venerable-sherbet-10d546.netlify.app/*` to `https://numeraise.com/:splat`,
plus `X-Robots-Tag: noindex` on preview and branch contexts.

After deploying, confirm it worked:

```bash
curl -sI https://venerable-sherbet-10d546.netlify.app/ | head -3
```

You want `HTTP/2 301` and a `location:` header pointing at numeraise.com. If it
still returns 200, fall back to **Site configuration → Build & deploy → Deploy
Prime URL** protection in the Netlify UI.

---

## Part 3 — Content queue

**Do not bulk-generate these.** Publishing ~30 near-identical long pages in one
batch is "scaled content abuse" under Google's spam policies and is more likely
to suppress the domain than lift it. Three or four a week, each genuinely
different, is the right pace.

Add entries to `src/config/calculator-deep-content.ts`. `DynamicSEO` picks them
up automatically; anything not migrated falls back to the existing inline copy.

Done (707–846 words each, all with valid FAQ schema):
`epf-calculator` (846) · `pomis-calculator` (833) · `rental-yield` (811) ·
`hra-exemption` (764) · `break-even-calculator` (734) · `scss-calculator` (707)

Aim for 800+ visible words per page. That is enough to compete on long-tail
queries; chasing an arbitrary 1,500-word target produces padding, which is worse
than a tight 800.

Remaining, ordered by value ÷ effort:

| Priority | Slug | Current words |
|----------|------|---------------|
| 1 | `capital-gains-tax` | 145 |
| 2 | `credit-card-payoff` | 154 |
| 3 | `ssy-calculator` | 104 |
| 4 | `nps-calculator` | 190 |
| 5 | `ppf-calculator` | 228 |
| 6 | `rd-calculator` | 161 |
| 7 | `swp-calculator` | 234 |
| 8 | `step-up-sip` | 247 |
| 9 | `advance-tax` | 136 |
| 10 | `tds-calculator` | 132 |

Then: `nsc-calculator`, `gratuity-calculator`, `pension-calculator`,
`fire-calculator`, `human-life-value`, `health-insurance-calculator`,
`life-insurance-premium`, `stamp-duty`, `loan-refinance`,
`education-loan-calculator`, `personal-loan-calculator`, `car-loan-emi`,
`mutual-fund-returns`, `stock-profit`, `dividend-yield`, `margin-calculator`,
`markup-calculator`, `roi-calculator`, `discount-calculator`, `ebitda-calculator`,
`inflation-calculator`, `crypto-profit`, `forex-pip`.

---

## Part 4 — Expectations

Be realistic about the timeline, because the alternative is abandoning this at
month four when it looks like nothing is working.

- **Weeks 1–2:** Bing begins indexing. Google recrawls and picks up the new
  titles, descriptions and canonicals. The 18 previously-duplicate pages become
  eligible for indexing for the first time.
- **Weeks 3–8:** Indexed page count rises. First impressions on long-tail
  queries. Traffic still close to zero — this is normal and not a signal of
  failure.
- **Months 3–6:** Long-tail rankings, assuming backlinks are being built and
  content is being deepened. First meaningful traffic.
- **Months 6–12:** Competitive terms become reachable — but only with a real
  backlink profile.

You cannot win "SIP calculator" this year. ClearTax, Groww and Bankrate have
decade-old domains and thousands of referring domains. You can win
"SIP calculator with step-up and inflation adjustment" or "PPF vs SSY for a girl
child born 2026" — and those queries convert better anyway.

One caution on AdSense: driving ad revenue before you have organic traffic is
not achievable, and thin pages carrying ad code are a policy risk. Fix the
content first; the revenue follows the traffic, never the other way round.

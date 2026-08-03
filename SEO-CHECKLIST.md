# Numeraise SEO status

Last verified: 3 Aug 2026, against production, all 127 sitemap URLs crawled.

Domain registered 8 June 2026, so the site is roughly eight weeks old. It now
runs on Vercel with `numeraise.com` as the canonical apex.

---

## Current state — every technical check passes

```
pages crawled                     127 / 127
missing canonical                   0
canonical not self-referential      0
any www reference in HTML           0
missing meta description            0
not index,follow                    0
duplicate titles                    0
duplicate descriptions              0
duplicate H1                        0
title over 62 / under 25 chars      0
description over 165 / under 110    0
pages without Organization node     0
dangling @id references             0
calculators without FAQ schema      0   (73/73 have it)
images missing alt                  0
pages with 0 or >1 h1               0
unlabelled form controls            0
unverified CFA claim                0
scaffold PLACEHOLDER text           0
```

Infrastructure verified: apex serves 200, `www` and `numeraise.vercel.app` both
308 to it, sitemap lists 127 apex URLs that all return 200, robots.txt points at
the apex sitemap, 404s return 404, analytics live (`G-5KZWHTJNJ4`), IndexNow key
and Google verification files serving.

Average 504 visible words per page.

---

## Decisions taken, and why

**The CFA designation was removed.** Eleven markdown files bylined posts "Rahul
Sharma, CFA" and the root layout hardcoded it into a site-wide author meta tag.
The charter could not be verified. The CFA Institute enforces designation use,
and an unverifiable credential on a YMYL finance site suppresses rather than
builds trust. The decision is asymmetric: removing it is reversible in one line,
publishing a false claim is not.

If the charter *is* held, add `'CFA'` to `credentials` in `src/config/authors.ts`
— it propagates to every byline, meta tag and JSON-LD node on the next build.
Content files no longer control credentials, by design.

**Two factual errors were found and corrected** after a source check:

- The HRA metro list was out of date. The Income-tax Rules 2026 (Rule 279) added
  Bengaluru, Hyderabad, Pune and Ahmedabad from 1 April 2026, taking the 50%
  list to eight cities. The old copy told readers claiming 50% in Bengaluru was
  an error — it would have caused under-claiming in four major cities.
- The EPF split claimed ~15.67% of basic compounds in EPF. That holds only at or
  below the ₹15,000 EPS wage ceiling. Above it, EPS caps at ₹1,250 and the
  remainder goes to EPF — 21.5% on a ₹50,000 basic.

Verified as correct and left alone: POMIS 7.4% / ₹9L / ₹15L, SCSS 8.2% / ₹30L /
ages 60-55-50, the 8.33%–3.67% employer split, the least-of-three HRA structure,
the landlord PAN threshold.

**Mobile UX was audited at 375×812 and needed no changes.** No horizontal
overflow, tables fit with an `overflow-x: auto` fallback, no inputs trigger iOS
zoom, and the slider thumb has a 44×44 effective hit area via `after:-inset-3`.

---

## What actually limits this site now

Neither item is code. Both were true before this work and remain true.

### 1. One backlink

Bing's own dashboard says it: *"Your site does not have enough inbound links
from high quality domains."* Every technical check above passes; this is what
sits between the site and traffic.

`BACKLINKS.md` holds four ready-to-paste snippets for pomiscalculator.in. Worth
doing when you set that site up, but be clear-eyed: it takes you from one
backlink to about four, and search engines discount links between sites under
common ownership. Housekeeping, not strategy.

Realistic sources, in rough order of value:

1. A Product Hunt or Indie Hackers launch — real referring domains, one afternoon.
2. Reddit (r/IndiaInvestments, r/personalfinanceindia) — read each subreddit's
   self-promotion rules first. A genuinely useful answer that happens to link a
   calculator works; a bare link does not.
3. Free-tool directories — AlternativeTo, SaaSHub and similar. Low value each,
   but real domains and quick.
4. Your own social profiles. The Facebook, Instagram and X accounts are already
   in the Organization `sameAs`. Make sure each bio contains the literal string
   "Numeraise" and links to numeraise.com — this also helps the brand collision
   below.
5. One piece of original data — e.g. PPF vs SSY vs SCSS returns compared across
   the last ten rate revisions. Original analysis is the only reliable way to
   earn links you did not ask for.

**Do not buy links.** A manual action on a site carrying AdSense is a far worse
outcome than slow growth.

### 2. Content depth on the money pages

A competitive crawl of the SERP numeraise loses for "sip calculator":

| Site | Words |
|---|---|
| numeraise (after expansion) | **1,328** |
| sipemicalc.com | 971 |
| numerral.com | 1,287 |
| planmymoney.in | 1,547 |
| Groww | 2,211 |
| finlane.ai | 4,737 |

SIP was 597 words — last in its field — and is now mid-table. The same gap
exists on other high-intent pages.

---

## Content queue

Seven pages carry long-form content (707–1,328 words):
`sip-calculator` · `epf-calculator` · `pomis-calculator` · `rental-yield` ·
`hra-exemption` · `break-even-calculator` · `scss-calculator`

Add entries to `src/config/calculator-deep-content.ts`; `DynamicSEO` picks them
up automatically and anything not migrated falls back to existing inline copy.

**Do not bulk-generate these.** Publishing ~30 near-identical long pages at once
is scaled content abuse under Google's spam policies and is more likely to
suppress the domain than lift it. Three or four a week, each genuinely
different. Aim for 800+ visible words; chasing 1,500 produces padding.

Next, by value ÷ effort:

| # | Slug | Note |
|---|---|---|
| 1 | `emi-calculator` | highest intent after SIP, hand-written, not yet expanded |
| 2 | `income-tax-calculator` | high intent, India, old-vs-new regime |
| 3 | `capital-gains-tax` | 145 words |
| 4 | `credit-card-payoff` | 154 |
| 5 | `ssy-calculator` | 104 |
| 6 | `nps-calculator` | 190 |
| 7 | `ppf-calculator` | 228 |
| 8 | `rd-calculator` | 161 |
| 9 | `swp-calculator` | 234 |
| 10 | `step-up-sip` | 247 |

Then: `advance-tax`, `tds-calculator`, `nsc-calculator`, `gratuity-calculator`,
`pension-calculator`, `fire-calculator`, `human-life-value`,
`health-insurance-calculator`, `life-insurance-premium`, `stamp-duty`,
`loan-refinance`, `education-loan-calculator`, `personal-loan-calculator`,
`car-loan-emi`, `mutual-fund-returns`, `stock-profit`, `dividend-yield`,
`margin-calculator`, `markup-calculator`, `roi-calculator`,
`discount-calculator`, `ebitda-calculator`, `inflation-calculator`,
`crypto-profit`, `forex-pip`.

The 59 pages under 300 words are mostly glossary entries (178–193 words) and
legal pages. That is defensible for those page types — do not pad them.

---

## Open items needing a human

- **Author bio.** `src/config/authors.ts` holds one verified sentence. Real
  background — actual experience, what prompted the site — is the highest-value
  E-E-A-T improvement available and cannot be invented. Scaffold text prefixed
  `PLACEHOLDER` is filtered out and never published, so it is safe to leave
  while drafting.
- **A LinkedIn URL** in the author `sameAs` array. Single highest-value entry.
- **Brand collision.** "Numeraise" is one character from *numéraire*, an
  economics term in the same subject domain; Bing autocorrects the query and the
  site does not rank for its own name. `alternateName` and `knowsAbout` are set
  on the Organization node, but the rest is off-page entity building: a LinkedIn
  company page, a Crunchbase entry, and backlinks using "Numeraise" as anchor
  text. Low urgency — brand search volume on an eight-week-old site is near zero
  and traffic will come from "sip calculator", not "numeraise".
- **Geo-targeting titles.** Every competitor puts "India" in the title; the site
  does not. It fits the India-only tools (PPF, EPF, SCSS, POMIS, HRA, SSY, NSC,
  gratuity) but would be wrong on the multi-market ones (401k, US mortgage,
  paycheck). A judgement call, not a defect.
- **AdSense.** `NEXT_PUBLIC_ADSENSE_ID` is unset, so no ad code loads. Before
  re-enabling: an earlier measurement on the old host found the ad chain was 45%
  of page bytes and returning `data-ad-status: "unfilled"` — all cost, no
  revenue. Only turn it on once AdSense is approved and actually filling.

---

## Expectations

- **Weeks 1–2:** Google recrawls and picks up the corrected canonicals now that
  the domain and canonicals finally agree. The GSC "Duplicate, Google chose
  different canonical" validation should clear.
- **Weeks 3–8:** indexed page count rises, first long-tail impressions. Traffic
  still near zero — normal, not failure.
- **Months 3–6:** long-tail rankings, assuming backlinks are being built and
  content deepened. First meaningful traffic.
- **Months 6–12:** competitive terms become reachable, but only with a real
  backlink profile.

"SIP calculator" is not winnable this year. "SIP calculator with step-up and
inflation adjustment" is — and it converts better anyway.

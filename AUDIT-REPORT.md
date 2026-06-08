# Final Audit Report: Numeraise Finance Platform

**Date:** June 8, 2026
**Scope:** Full codebase analysis (build, lint, TypeScript, logic audit)
**Status:** Build passes ✅ | 165 ESLint errors | 53 warnings | 0% test coverage

---

## 🔴 CRITICAL (will cause errors or broken UX for users)

### C1. Category pages have broken template literals
**File:** `src/app/(main)/calculators/category/[category]/page.tsx:23-25, 64-66`

Uses `?{section.category}` instead of `${section.category}`. Every category page renders literal `?{section.category} Calculators` as its `<title>` and meta description. All SEO metadata for category pages is broken.

### C2. Blog rewrite points to non-existent file
**File:** `next.config.ts:7-10`

Rewrite `/blog` → `/blog/index.html` but no `/blog` route or static file exists. Users visiting `/blog` get a 404.

### C3. `/articles/[slug]` has zero content
**File:** `src/content/` (empty), `src/lib/blog.ts`

`src/content/blog/` doesn't exist. The `/articles` listing page shows hardcoded placeholder cards with fake titles. Dynamic article routes return null for every slug.

### C4. Hydration mismatch risk on every calculator page
**File:** `src/components/calculators/dynamic-calculator-client.tsx:239`

`if (!isMounted) return null` prevents SSR from rendering anything, then client hydration renders the full UI. Causes layout shift on all ~30+ calculators.

### C5. Rent Paid metric always shows zero
**File:** `src/lib/comparison-engine.ts:163`

"Rent Paid Over Tenure" is hardcoded to `0` with comment `// Simplified`. Misleading displayed value.

---

## 🟠 HIGH (functional/logical errors)

### H1. Conditional `useMemo` breaks Rules of Hooks
**File:** `src/components/compare/scenario-client.tsx:29-31`

`if (!config) return null;` placed before `useMemo`. React requires hooks to always run in same order.

### H2. CSV export produces malformed data
**File:** `src/components/calculators/dynamic-calculator-client.tsx:198-208`

`.replace(/,/g, '')` strips commas but keeps currency symbols (`₹`, `$`). Values like `₹1,00,000` become `₹100000` — unparseable by Excel/Sheets.

### H3. `userScalable: false` violates accessibility
**File:** `src/app/layout.tsx:64`

Users cannot pinch-zoom. WCAG accessibility failure.

### H4. Auth exposed without working database
**File:** `src/lib/auth.ts:6`

Line 6: `// Add PrismaAdapter here when db is connected`. Route `/api/auth/[...nextauth]` is live but authentication silently fails.

### H5. Comparison engine rent-vs-buy logic issue
**File:** `src/lib/comparison-engine.ts:140-145`

Surplus calculation assumes `emi - rent` is always positive or negative but doesn't handle the portfolio correctly when rent exceeds EMI (negative surplus deducts from portfolio, but the borrowed amount is not tracked as debt).

---

## 🟡 MEDIUM (code quality / maintainability)

| ID | Issue | Files | Details |
|----|-------|-------|---------|
| M1 | `any` types | 10+ files | `dynamic-calculator-client.tsx`, `data-table.tsx`, `circular-statistics.tsx`, `growth-chart.tsx`, `breakdown-chart.tsx`, `structured-data.tsx`, `slider-input.tsx`, `result-actions.tsx` |
| M2 | setState in useEffect | 8 files | `CurrencyContext.tsx`, `recently-viewed.tsx`, `dynamic-calculator-client.tsx`, `sip-calculator`, `us-mortgage-calculator`, `term-insurance-calculator`, `pregnancy-due-date`, `flat-vs-reducing-loan` |
| M3 | Unescaped entities | ~100 instances, 20+ files | `"` → should be `&quot;`, `'` → should be `&apos;` in JSX |
| M4 | Unused imports/vars | 50+ warnings | `useDeferredValue` (term-insurance), `RelatedArticles` (sip-calculator, us-mortgage), `CardHeader/CardTitle` (tip-calculator), `CalculatorConfig` (dynamic-calculator-client), `Car` (config/calculators), `Landmark`, `ShieldAlert`, `CalculatorLayout`, `ArrowRight`, `Save`, `CardDescription` |
| M5 | Missing/excessive useMemo deps | 4 files | `salary-calculator`, `tip-calculator` missing `format`; `rent-vs-buy`, `sip-vs-lumpsum` unnecessary `currency.rate` |
| M6 | Hardcoded `₹` symbol | `scenario-client.tsx:36,74,118` | Ignores currency context; breaks when user switches to USD/EUR |
| M7 | Partial slug matching | `calculators/[slug]/page.tsx:10`, `config/calculators.tsx:155` | `.includes(slug)` can match partial slugs |
| M8 | Inconsistent URL casing | `sitemap.ts:5` vs `layout.tsx:22` | `Numeraise.com` (capital N) vs `numeraise.com` (lowercase) — SEO duplicate content risk |
| M9 | Admin page hardcoded mock data | `admin/page.tsx:14-33` | "12 calculators", "1,204 users", "$4,231.89 revenue" — static numbers |
| M10 | 16 Python/JS scripts are dead code | Root directory | `fix-blog-links.mjs`, `fix-seo.mjs`, `inject-faqs.py`, `patch-seo.mjs`, etc. — many automated fixes never integrated |
| M11 | `NEXT_PUBLIC_APP_URL` not in `.env` | `.env` | Sitemap, robots, layout all use it; falls back to wrong hardcoded URL |
| M12 | Scattered imports | `layout.tsx` | `Breadcrumbs`, `QuickLauncher`, `Viewport` imported mid-file after component logic |

---

## 🔵 LOW (minor / cosmetic)

| ID | Issue | Details |
|----|-------|---------|
| L1 | `prefer-const` warnings | `comparison-engine.ts:195,203` — `taxableOld`, `taxableNew` declared with `let`, never reassigned |
| L2 | Unused `age` parameter | `lib/calculations/tax.ts:11` — function accepts `age` but never uses it |
| L3 | Unused catch variables | `blog.ts:63`, `CurrencyContext.tsx:60`, `dynamic-calculator-client.tsx:153,173`, `recently-viewed.tsx:24` |
| L4 | No tests | `package.json` has no test script. Zero test files in entire project. |
| L5 | Mixed naming conventions | `.mjs` + `.py` fix scripts suggest multiple authors without consolidation |
| L6 | Missing Loading/Error boundaries | No `loading.tsx` or `error.tsx` in any route segment |
| L7 | Hardcoded `INR_BASE_RATE = 83` | `dynamic-calculator-client.tsx:15` — duplicates the INR rate from `CurrencyContext` instead of using it |

---

## 📊 Codebase Health Summary

```
Metric                    | Value
--------------------------|--------
Total pages               | 63 (all build successfully)
ESLint errors             | 165
ESLint warnings           | 53
Unused imports/vars       | 50+
`any` types               | 10+
Unescaped entities        | ~100 across 20+ files
setState-in-effect        | 8 instances
Missing template literals | 3 instances in category page
Empty content directories | src/content/
Mock/hardcoded pages      | Admin dashboard, Articles listing
Test coverage             | 0%
Active API routes         | 1 (auth — non-functional)
Python/JS automation      | 16 scripts, mostly unapplied
```

---

## 🥇 Top 10 Actions by Impact

| Rank | Action | Impact | Effort |
|------|--------|--------|--------|
| 1 | Fix `?{` → `${` in `category/[category]/page.tsx` | Fixes SEO metadata for 11 category pages | 1 min |
| 2 | Fix/remove `/blog` rewrite in `next.config.ts` | Eliminates 404 on blog route | 1 min |
| 3 | Seed `src/content/blog/` or remove broken article routes | Fixes dead `/articles/[slug]` | 15 min |
| 4 | Move `useMemo` before early return in `scenario-client.tsx` | Fixes Rules of Hooks violation | 2 min |
| 5 | Fix CSV export to strip symbols, wrap in quotes | Makes CSV downloads usable | 5 min |
| 6 | Remove `userScalable: false` from viewport | Fixes WCAG accessibility issue | 1 min |
| 7 | Replace `!isMounted` pattern with SSR-safe initialization | Eliminates hydration mismatch on all calculators | 20 min |
| 8 | Add `NEXT_PUBLIC_APP_URL` to `.env` with consistent casing | Fixes canonical URL/sitemap inconsistency | 1 min |
| 9 | Connect PrismaAdapter to NextAuth or disable auth route | Prevents silent auth failures | 10 min |
| 10 | Fix "Rent Paid Over Tenure" zero in comparison engine | Fixes misleading displayed value | 5 min |

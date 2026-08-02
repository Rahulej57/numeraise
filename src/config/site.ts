/**
 * Single source of truth for every absolute URL the site emits.
 *
 * Every canonical, sitemap entry, robots directive, Open Graph tag and JSON-LD
 * @id must derive from SITE_URL. Never hardcode the domain anywhere else --
 * mixed www / non-www signals split ranking authority between two hostnames
 * and are the reason canonical, og:url and JSON-LD previously disagreed.
 *
 * Production serves the apex (no www); www 301-redirects to it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://numeraise.com').replace(/\/$/, '');

export const SITE_NAME = 'Numeraise';

export const SITE_TAGLINE = 'Free Financial Calculators for Investment, Loans & Tax';

export const SITE_DESCRIPTION =
  'Free financial calculators for SIP, EMI, income tax, PPF, retirement and more. Transparent formulas, no signup, no data leaves your browser.';

export const CONTACT_EMAIL = 'support@numeraise.com';

/** Public profiles used for the Organization `sameAs` trust signal. */
export const SOCIAL_PROFILES = [
  'https://www.facebook.com/people/Numeraise/61590729753165/',
  'https://www.instagram.com/numeraise',
  'https://x.com/numeraise',
];

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Stable content-revision date, in ISO form.
 *
 * Sitemap `lastmod` previously used `new Date()` at build time, which restamped
 * all 116 URLs as "just modified" on every deploy. Search engines detect that
 * pattern and stop trusting lastmod entirely. Bump this only when page content
 * genuinely changes.
 */
export const CONTENT_REVISION_DATE = '2026-08-02';

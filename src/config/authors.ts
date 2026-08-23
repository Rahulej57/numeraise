/**
 * Author profiles. This file is the single source of truth for how an author is
 * named and credentialled anywhere on the site.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ON THE CFA DESIGNATION — a decision was made here, read before reverting
 * ─────────────────────────────────────────────────────────────────────────────
 * Blog frontmatter previously bylined all eleven posts "Rahul Sharma, CFA", and
 * the root layout hardcoded the same string into a site-wide author meta tag.
 * The charter could not be verified, so the designation has been removed from
 * `credentials` below and from every file under src/content/blog/.
 *
 * The reasoning, so this is not undone by accident:
 *  - The CFA Institute actively enforces designation use. Asserting the charter
 *    without holding it is a real liability, not a stylistic choice.
 *  - On a YMYL finance site an unverifiable credential is the kind of trust
 *    signal that gets a domain suppressed rather than promoted.
 *  - The decision is asymmetric. Removing it costs almost nothing and is
 *    reversible in one line. Publishing a false claim is neither.
 *
 * IF THE CHARTER IS GENUINELY HELD AND CURRENT: add 'CFA' to `credentials`
 * below. That is the only change needed — every byline, meta tag and JSON-LD
 * node derives from this array, so it will propagate site-wide on next build.
 * Do not re-add it to the markdown frontmatter; content files no longer control
 * credentials, by design.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STILL WORTH FILLING IN
 * ─────────────────────────────────────────────────────────────────────────────
 * `bio` currently holds one verified sentence. Real background — actual
 * experience with finance or software, what prompted the site — is the highest
 * value E-E-A-T improvement available. Any paragraph prefixed PLACEHOLDER is
 * filtered out by publishableBio() and will never be published, so scaffold
 * text here is safe to leave while you draft.
 *
 * `sameAs`: Google verifies author identity by matching a byline to off-site
 * profiles. A LinkedIn URL is the single highest-value entry. An empty array is
 * better than a fabricated one.
 */
export interface Author {
  slug: string;
  name: string;
  /** Shown under the name. Keep it accurate. */
  role: string;
  /** Professional credentials. Leave empty unless genuinely held and verifiable. */
  credentials: string[];
  /** 2-4 sentences. Concrete experience beats adjectives. */
  bio: string[];
  /** Public profile URLs used for the Person `sameAs` signal. */
  sameAs: string[];
  email?: string;
  /** Remove once the profile has been reviewed and filled in with real details. */
  needsReview?: boolean;
}

export const AUTHORS: Record<string, Author> = {
  'rahul-sharma': {
    slug: 'rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Founder and Editor, Numeraise',
    // Empty by decision, not by omission. See the note at the top of this file.
    // Add 'CFA' here only if the charter is genuinely held and current; it will
    // then propagate to every byline, meta tag and JSON-LD node automatically.
    credentials: [],
    bio: [
      'Rahul is a software engineer and financial tools developer who designs and maintains the calculation engines on Numeraise.',
      'With a background in quantitative modeling and software architecture, he built Numeraise to provide completely transparent, ad-light financial calculations across investments, loan amortisation, and tax optimization.',
      'All computational models on Numeraise are regularly benchmarked against regulatory frameworks published by the Reserve Bank of India (RBI), the Central Board of Direct Taxes (CBDT), and the Employees’ Provident Fund Organisation (EPFO).',
    ],
    sameAs: [
      'https://github.com/Rahulej57',
      'https://x.com/numeraise',
      'https://www.facebook.com/people/Numeraise/61590729753165/',
      'https://www.instagram.com/numeraise',
    ],
    email: 'support@numeraise.com',
    needsReview: false,
  },
};

export const AUTHOR_SLUGS = Object.keys(AUTHORS);

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS[slug];
}

/** Resolve a byline string like "Rahul Sharma, CFA" to an author profile. */
export function findAuthorByName(name: string): Author | undefined {
  const base = name.split(',')[0].trim().toLowerCase();
  return Object.values(AUTHORS).find((a) => a.name.toLowerCase() === base);
}

/**
 * Bio paragraphs that are safe to publish.
 *
 * Scaffold text is marked with a PLACEHOLDER prefix and filtered here rather
 * than relying on someone remembering to delete it. Both placeholder paragraphs
 * were live on /authors/rahul-sharma as visible body copy — on a page whose
 * entire purpose is establishing credibility, which made it worse than having
 * no author page at all.
 */
export function publishableBio(author: Author): string[] {
  return author.bio.filter((p) => !p.trimStart().toUpperCase().startsWith('PLACEHOLDER'));
}

/**
 * The byline to publish for a given author.
 *
 * Markdown frontmatter bylines the posts as "Rahul Sharma, CFA", but this
 * config is the only place a credential is treated as verified. Any suffix in
 * the frontmatter is discarded and rebuilt from `credentials`, so an
 * unverified designation cannot leak into a meta tag or JSON-LD via a content
 * file. Claiming a professional credential that is not held is a real
 * liability on a financial site, not a cosmetic issue.
 */
export function displayByline(author: Author): string {
  return author.credentials.length ? `${author.name}, ${author.credentials.join(', ')}` : author.name;
}

/** Byline for a raw frontmatter string, falling back to the raw name if unknown. */
export function bylineFor(rawAuthor: string): string {
  const profile = findAuthorByName(rawAuthor);
  return profile ? displayByline(profile) : rawAuthor;
}

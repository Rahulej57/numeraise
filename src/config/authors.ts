/**
 * Author profiles.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTION REQUIRED BEFORE DEPLOYING
 * ─────────────────────────────────────────────────────────────────────────────
 * The fields below are a scaffold, not finished copy. Fill them in with real,
 * verifiable details and delete the `needsReview` flag.
 *
 * Two things matter here specifically:
 *
 * 1. CREDENTIALS. Blog frontmatter currently bylines posts as "Rahul Sharma,
 *    CFA". Only claim the CFA charter if it is genuinely held and current --
 *    the CFA Institute actively enforces designation use, and an unverifiable
 *    professional credential on a financial site is exactly the trust signal
 *    that gets a YMYL domain suppressed rather than promoted. If the charter is
 *    not held, remove it from `credentials` here AND from the `author:` line in
 *    every file under src/content/blog/. An honest "personal finance writer" is
 *    worth far more than an unverifiable "CFA".
 *
 * 2. `sameAs` LINKS. Google verifies author identity by matching a byline to
 *    off-site profiles. A LinkedIn URL is the single highest-value entry here.
 *    An empty array is better than a fabricated one.
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
    // TODO: Remove 'CFA' unless the charter is genuinely held and current.
    credentials: [],
    bio: [
      'Rahul builds and maintains every calculator on Numeraise, and writes the guides that explain them.',
      // TODO: Replace the two paragraphs below with real background -- years
      // working in or around finance, what prompted the site, any relevant
      // qualification. Specifics are what make an author page work; generic
      // "passionate about personal finance" copy adds nothing.
      'PLACEHOLDER: Add two or three sentences of genuine background here. What is your professional experience with finance or software? What made you build this? Concrete detail is what search engines and readers both respond to.',
      'PLACEHOLDER: Add what you focus on writing about, and how readers can reach you with corrections.',
    ],
    // TODO: Add a LinkedIn profile URL here -- highest-value entry by a wide margin.
    sameAs: ['https://x.com/numeraise'],
    email: 'support@numeraise.com',
    needsReview: true,
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

/**
 * Host-agnostic deployment environment detection.
 *
 * The site previously ran on Netlify and is moving to Vercel. Rather than rely
 * on either host's default behaviour for keeping non-production deployments out
 * of search results, this decides it in code.
 *
 * Why that matters: on Netlify the preview domain
 * (venerable-sherbet-10d546.netlify.app) served a fully crawlable copy of the
 * entire production site — robots.txt said "Allow: /" and no X-Robots-Tag was
 * set — because the rule meant to block it used Cloudflare Pages syntax that
 * Netlify silently ignores. The same class of mistake is easy to repeat on a new
 * host. Deciding it here means it cannot silently regress again.
 */

/** True only for a real production deployment serving the canonical domain. */
export function isProductionDeployment(): boolean {
  // Vercel sets VERCEL_ENV to 'production' | 'preview' | 'development'.
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';

  // Netlify sets CONTEXT to 'production' | 'deploy-preview' | 'branch-deploy'.
  if (process.env.CONTEXT) return process.env.CONTEXT === 'production';

  // Any other host: treat an explicitly configured canonical URL as the signal.
  // Falling back to `true` here would re-open the exact hole described above,
  // so the safe default is "not production".
  return process.env.NEXT_PUBLIC_APP_URL !== undefined;
}

/**
 * Robots directives for the current deployment.
 *
 * Preview and branch deployments get `noindex, nofollow` so a generated
 * *.vercel.app or *.netlify.app URL can never compete with the canonical domain.
 */
export const ROBOTS_DIRECTIVE = isProductionDeployment()
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    }
  : { index: false, follow: false, nocache: true };

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { isProductionDeployment } from '@/config/deployment';

export default function robots(): MetadataRoute.Robots {
  // Preview and branch deployments must never be crawlable. On Netlify the
  // preview host previously served a fully indexable duplicate of the entire
  // site; this makes that impossible regardless of which host we are on.
  if (!isProductionDeployment()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/'],
      },
      // AdSense needs to fetch pages to decide which ads to serve. Without this
      // an over-broad crawl rule can degrade ad targeting and fill rate.
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

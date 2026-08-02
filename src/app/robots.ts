import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
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

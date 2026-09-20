import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The coach's panel and a half-finished checkout have no business in
      // search results.
      disallow: ['/admin', '/checkout'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

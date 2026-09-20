import type { MetadataRoute } from 'next';
import { courses, retreats, journal } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/book`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/retreats`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/workshops`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/journal`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...courses.map((course) => ({
      url: `${SITE_URL}/courses/${course.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...retreats.map((retreat) => ({
      url: `${SITE_URL}/retreats/${retreat.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...journal.map((post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}

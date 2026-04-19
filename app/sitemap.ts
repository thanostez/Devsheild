import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devshield.vercel.app';

  const routes = [
    '',
    '/npm-audit',
    '/credential-check',
    '/breach-timeline',
    '/docs',
    '/privacy-policy',
    '/terms-and-conditions',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devsheild.live';

  const routes = [
    '',
    '/npm-audit',
    '/credential-check',
    '/breach-timeline',
    '/docs',
    '/blog',
    '/blog/software-supply-chain-attacks',
    '/blog/mastering-npm-audit',
    '/blog/credential-hygiene-2024',
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

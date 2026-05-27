import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/select-course/', '/test/'],
    },
    sitemap: 'https://projxpertlabs.pro/sitemap.xml',
  };
}

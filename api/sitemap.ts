import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const BASE_URL = 'https://victor-chidera-25.vercel.app';
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const routes = [
    { path: '/',              changefreq: 'monthly',  priority: '1.0' },
    { path: '/works',         changefreq: 'monthly',  priority: '0.9' },
    { path: '/services',      changefreq: 'monthly',  priority: '0.8' },
    { path: '/testimonials',  changefreq: 'monthly',  priority: '0.7' },
    { path: '/blog',          changefreq: 'weekly',   priority: '0.8' },
    { path: '/contact',       changefreq: 'yearly',   priority: '0.6' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(xml);
}

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const distDir = path.join(root, 'dist');

const site = (process.env.SITE || 'https://telugu-panchangam.com').replace(/\/$/, '');

const dataPath = path.join(root, 'data', '2026-daysByDate.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const year = JSON.parse(raw);

const dates = Object.keys(year.daysByDate).sort();
const months = Array.from(new Set(dates.map(d => d.slice(0, 7)))).sort();

const langs = ['en', 'te'];

// Define URL structure with priority and changefreq for better SEO
const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

const urlConfigs = [
  { url: `/`, priority: 1.0, changefreq: 'daily' },
  ...langs.flatMap(l => [
    { url: `/${l}/`, priority: 0.9, changefreq: 'daily' },
    { url: `/${l}/today/`, priority: 1.0, changefreq: 'daily' },
    // Date pages - higher priority for current and upcoming dates
    ...dates.map(d => ({
      url: `/${l}/date/${d}/`,
      priority: d === today ? 1.0 : d > today ? 0.8 : 0.6,
      changefreq: d === today ? 'hourly' : d >= today ? 'daily' : 'monthly'
    })),
    // Month pages - higher priority for current month
    ...months.map(m => ({
      url: `/${l}/month/${m}/`,
      priority: m === currentMonth ? 0.9 : 0.7,
      changefreq: m === currentMonth ? 'daily' : 'weekly'
    })),
    { url: `/${l}/festivals/`, priority: 0.8, changefreq: 'weekly' },
    { url: `/${l}/festivals/2026/`, priority: 0.9, changefreq: 'weekly' },
    { url: `/${l}/about/`, priority: 0.5, changefreq: 'monthly' },
  ]),
];

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const now = new Date().toISOString();

const body = urlConfigs.map(config => {
  const loc = xmlEscape(`${site}${config.url}`);
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority.toFixed(1)}</priority>
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

if (!fs.existsSync(distDir)) {
  console.warn('dist/ not found yet. Run `npm run build` first.');
  process.exit(0);
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`Generated sitemap.xml with ${urlConfigs.length} URLs (with priority and changefreq)`);

const robotsPath = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf-8')
    .replace(/Sitemap:.*$/m, `Sitemap: ${site}/sitemap.xml`);
  fs.writeFileSync(robotsPath, robots, 'utf-8');
}

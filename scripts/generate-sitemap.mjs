import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const distDir = path.join(root, 'dist');

const site = (process.env.SITE || 'https://example.com').replace(/\/$/, '');

const dataPath = path.join(root, 'data', '2026-daysByDate.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const year = JSON.parse(raw);

const dates = Object.keys(year.daysByDate).sort();
const months = Array.from(new Set(dates.map(d => d.slice(0, 7)))).sort();

const langs = ['en', 'te'];

const urls = [
  '/',
  ...langs.flatMap(l => [
    `/${l}`,
    `/${l}/today`,
    ...dates.map(d => `/${l}/date/${d}`),
    ...months.map(m => `/${l}/month/${m}`),
    `/${l}/festivals`,
    `/${l}/festivals/2026`,
    `/${l}/about`,
  ]),
];

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const now = new Date().toISOString();

const body = urls.map(u => {
  const loc = xmlEscape(`${site}${u}`);
  return `  <url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

if (!fs.existsSync(distDir)) {
  console.warn('dist/ not found yet. Run `npm run build` first.');
  process.exit(0);
}

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`Generated sitemap.xml with ${urls.length} URLs`);

const robotsPath = path.join(distDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf-8')
    .replace(/Sitemap:.*$/m, `Sitemap: ${site}/sitemap.xml`);
  fs.writeFileSync(robotsPath, robots, 'utf-8');
}

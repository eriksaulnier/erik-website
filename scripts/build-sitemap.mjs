// Postbuild: writes out/sitemap.xml and checks the one image that
// resolveImages never sees (the global thumbnail, imported directly by _app.js).
import { access, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getGlobal, listPageSlugs } from '../lib/content.mjs';

const BASE_URL = 'https://eriksaulnier.com';

const { thumbnail } = await getGlobal();
if (thumbnail?.src) {
  await access(join(process.cwd(), 'public', thumbnail.src)).catch(() => {
    throw new Error(
      `Image not found: ${thumbnail.src} in content/global.json at thumbnail`,
    );
  });
}

// Reachable only by direct link, on purpose.
const UNLISTED = new Set(['about/uses']);

const paths = [
  '/',
  ...(await listPageSlugs())
    .filter((slug) => !UNLISTED.has(slug))
    .map((slug) => `/${slug}`),
  '/projects',
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url>\n    <loc>${BASE_URL}${path === '/' ? '/' : path}</loc>\n  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(process.cwd(), 'out', 'sitemap.xml'), xml);
console.log(`Wrote out/sitemap.xml with ${paths.length} URLs`);

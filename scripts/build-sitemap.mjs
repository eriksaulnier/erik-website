// Postbuild: writes out/sitemap.xml, checks the one image that resolveImages never sees (the
// global thumbnail, which getGlobal returns unresolved), and checks that every exported page has
// the layout, which _app.js skips for a page whose getStaticProps omits `site`.
import { access, readdir, readFile, writeFile } from 'node:fs/promises';
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

const outDir = join(process.cwd(), 'out');
const htmlFiles = (await readdir(outDir, { recursive: true })).filter(
  (file) => file.endsWith('.html') && !file.startsWith('_next'),
);
for (const file of htmlFiles) {
  if (!(await readFile(join(outDir, file), 'utf8')).includes('<footer')) {
    throw new Error(
      `Layout missing: out/${file} has no footer. Pass site: await getGlobal() from its getStaticProps`,
    );
  }
}

const paths = [
  '/',
  ...(await listPageSlugs()).map((slug) => `/${slug}`),
  '/projects',
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url>\n    <loc>${BASE_URL}${path === '/' ? '/' : path}</loc>\n  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(process.cwd(), 'out', 'sitemap.xml'), xml);
console.log(`Wrote out/sitemap.xml with ${paths.length} URLs`);

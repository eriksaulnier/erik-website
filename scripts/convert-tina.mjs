// One-time conversion from the Tina content repo to Keystatic files.
// Usage: node scripts/convert-tina.mjs <path to erik-website-content snapshot>
// Deleted after the import commit; see docs/designs/cloudflare-keystatic.md.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { parse, stringify } from 'yaml';

const SRC = process.argv[2];
if (!SRC) throw new Error('Usage: node scripts/convert-tina.mjs <snapshot path>');
const ROOT = process.cwd();
const IMAGE_HOST = 'https://uploads.eriksaulnier.com/';

const PAGES = ['about', 'about/uses', 'contact'];
const PROJECTS = [
  '2015/initialize-esports-logo',
  '2015/lunatik-esports',
  '2015/sneaky-spanish',
  '2016/rogue-esports-website-concept',
  '2017/digital-gaming-hub',
  '2017/storywings',
  '2019/pass-the-aux',
  '2021/portfolio-site',
];

const written = { files: [], images: [] };

async function readFrontmatter(path) {
  const text = await readFile(join(SRC, path), 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path}: no frontmatter`);
  if (match[2].trim()) throw new Error(`${path}: unexpected MDX body outside frontmatter`);
  return parse(match[1]);
}

async function writeOut(path, text) {
  await mkdir(dirname(join(ROOT, path)), { recursive: true });
  await writeFile(join(ROOT, path), text);
  written.files.push(path);
}

const toYaml = (data) => stringify(data, { lineWidth: 0 });

// Downloads a Tina image URL into public/ at `publicPath`, and returns the
// Keystatic `{src, alt}` shape.
async function image(url, publicPath, alt, where) {
  if (!url) return {};
  if (!url.startsWith(IMAGE_HOST)) throw new Error(`${where}: unexpected image host in ${url}`);
  const ext = url.slice(url.lastIndexOf('.'));
  const src = `${publicPath}${ext}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${where}: ${url} returned ${res.status}`);
  const file = join(ROOT, 'public', src);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  written.images.push(src);
  // Keystatic leaves an empty alt out of the file, so do the same to keep
  // the first admin save from rewriting every entry.
  return alt ? { src, alt } : { src };
}

// Tina stores the one inline image as a JSX-like <image /> tag.
async function convertBody(body, slug, where) {
  if (!body) return '';
  let out = body;
  for (const m of body.matchAll(/<image\s+src="([^"]+)"\s+alt="([^"]*)"[^>]*\/>/g)) {
    const url = m[1];
    const name = basename(url, url.slice(url.lastIndexOf('.')));
    const { src } = await image(url, `/images/pages/${slug}/${name}`, m[2], where);
    out = out.replace(m[0], `{% image src="${src}" alt="${m[2].replace(/\s+/g, ' ')}" /%}`);
  }
  if (/<[a-zA-Z]/.test(out)) throw new Error(`${where}: unconverted JSX remains`);
  return out.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

async function convertBlock(block, i, slug) {
  const where = `pages/${slug} block ${i}`;
  switch (block._template) {
    case 'content': {
      let body = await convertBody(block.body, slug, where);
      if (slug === 'contact') {
        const before = body;
        body = body.replace(/get in touch with\s+using the form below or\s+emailing/, 'get in touch by emailing');
        if (body === before) throw new Error(`${where}: contact form wording not found`);
      }
      const value = { body };
      if (block.title) value.title = block.title;
      value.aside_image = block.aside_image?.src
        ? await image(block.aside_image.src, `/images/pages/${slug}/blocks/${i}/value/aside_image/src`, block.aside_image.alt, where)
        : {};
      return { discriminant: 'content', value };
    }
    case 'technology':
      return { discriminant: 'technology', value: { title: block.title, categories: block.categories } };
    case 'form':
      return null;
    default:
      throw new Error(`${where}: unknown block template ${block._template}`);
  }
}

async function convertPage(slug) {
  const fm = await readFrontmatter(`pages/${slug}.mdx`);
  if (fm._template !== 'blocks') throw new Error(`pages/${slug}: unexpected template ${fm._template}`);
  if (fm.draft) throw new Error(`pages/${slug}: is a draft`);
  const blocks = [];
  for (const block of fm.blocks ?? []) {
    const converted = await convertBlock(block, blocks.length, slug);
    if (converted) blocks.push(converted);
  }
  const page = { title: fm.title, heading: fm.heading, draft: false };
  if (fm.seo_description) page.seo_description = fm.seo_description;
  page.blocks = blocks;
  await writeOut(`content/pages/${slug}.yaml`, toYaml(page));
}

async function convertHome() {
  const fm = await readFrontmatter('pages/home.mdx');
  if (fm._template !== 'splash') throw new Error('pages/home: expected the splash template');
  const { _template, ...home } = fm;
  await writeOut('content/home.yaml', toYaml(home));
}

async function convertProject(path) {
  const fm = await readFrontmatter(`projects/${path}.mdx`);
  const slug = basename(path);
  const date = new Date(fm.publish_date);
  if (Number.isNaN(date.getTime())) throw new Error(`projects/${path}: bad publish_date`);
  const project = {
    name: fm.name,
    draft: Boolean(fm.draft),
    featured: Boolean(fm.featured),
    // Tina saved midnight US Eastern as UTC, so the UTC date is the intended day.
    publish_date: date.toISOString().slice(0, 10),
    description: fm.description,
    technologies: fm.technologies ?? [],
    links: fm.links ?? [],
    thumbnail: await image(fm.thumbnail?.src, `/images/projects/${slug}/thumbnail/src`, fm.thumbnail?.alt, `projects/${path}`),
  };
  await writeOut(`content/projects/${slug}.yaml`, toYaml(project));
}

async function convertGlobal() {
  const cfg = JSON.parse(await readFile(join(SRC, 'global/app.config.json'), 'utf8'));
  cfg.thumbnail = await image(cfg.thumbnail, '/images/site/thumbnail/src', '', 'global');
  await writeOut('content/global.json', JSON.stringify(cfg, null, 2) + '\n');
}

// Drafts with no real content are left out on purpose. Any other file is a surprise.
const SKIPPED = ['pages/test.mdx', 'posts/2023/contact-forms-using-google-forms.mdx', 'posts/2023/hello-world.mdx'];
const known = new Set([
  'pages/home.mdx',
  ...PAGES.map((s) => `pages/${s}.mdx`),
  ...PROJECTS.map((p) => `projects/${p}.mdx`),
  ...SKIPPED,
]);
const { readdir } = await import('node:fs/promises');
const all = (await readdir(SRC, { recursive: true })).filter((f) => f.endsWith('.mdx'));
const unknown = all.filter((f) => !known.has(f));
if (unknown.length || all.length !== known.size) {
  throw new Error(`Snapshot does not match the expected file list. Unknown: ${unknown.join(', ') || 'none'}`);
}

await convertHome();
await convertGlobal();
for (const slug of PAGES) await convertPage(slug);
for (const path of PROJECTS) await convertProject(path);

const expect = { files: 1 + 1 + PAGES.length + PROJECTS.length, images: 11 };
for (const key of ['files', 'images']) {
  if (written[key].length !== expect[key]) {
    throw new Error(`Expected ${expect[key]} ${key}, wrote ${written[key].length}: ${written[key].join(', ')}`);
  }
}
console.log(`Wrote ${written.files.length} content files and ${written.images.length} images from ${relative(ROOT, SRC) || SRC}`);

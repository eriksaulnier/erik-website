import Markdoc from '@markdoc/markdoc';
import { createReader } from '@keystatic/core/reader';
import config from '../keystatic.config.mjs';
import { encodeEmail } from './email.mjs';
import { markdocConfig } from './markdoc-config.mjs';

const reader = createReader(process.cwd(), config);

// The reader returns Markdoc bodies as class instances, which Next refuses as props, so round-trip through JSON.
// Transform the children: transforming the document itself adds an <article> wrapper.
function toTree(body) {
  if (!body?.node) return null;
  return JSON.parse(
    JSON.stringify(Markdoc.transform(body.node.children, markdocConfig)),
  );
}

function transformBlocks(blocks) {
  return blocks.map((block) =>
    block.discriminant === 'content'
      ? { ...block, value: { ...block.value, body: toTree(block.value.body) } }
      : block,
  );
}

export async function getHome() {
  return reader.singletons.home.readOrThrow();
}

// The address is encoded here so the plain form never reaches page props or the exported bundle.
export async function getGlobal() {
  const global = await reader.singletons.global.readOrThrow();
  return {
    ...global,
    footer: { ...global.footer, email: encodeEmail(global.footer.email) },
  };
}

export async function getPage(slug) {
  const page = await reader.collections.pages.read(slug);
  if (!page || page.draft) return null;
  return { ...page, blocks: transformBlocks(page.blocks) };
}

export async function listPageSlugs() {
  const pages = await reader.collections.pages.all();
  return pages.filter(({ entry }) => !entry.draft).map(({ slug }) => slug);
}

export async function listProjects({ featuredOnly = false } = {}) {
  const projects = await reader.collections.projects.all();
  return projects
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .filter((p) => !p.draft && (!featuredOnly || p.featured))
    .sort((a, b) => (b.publish_date ?? '').localeCompare(a.publish_date ?? ''));
}

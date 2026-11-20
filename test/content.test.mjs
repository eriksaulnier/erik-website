import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getGlobal,
  getHome,
  getPage,
  listPageSlugs,
  listProjects,
} from '../lib/content.mjs';

test('listPageSlugs returns every published page, including nested slugs', async () => {
  assert.deepEqual((await listPageSlugs()).sort(), ['about', 'about/uses']);
});

test('getPage returns null for a page that does not exist', async () => {
  assert.equal(await getPage('nope'), null);
});

test('getPage turns Markdoc bodies into plain JSON trees', async () => {
  const page = await getPage('about/uses');
  const body = page.blocks[0].value.body;
  assert.ok(Array.isArray(body));
  assert.deepEqual(JSON.parse(JSON.stringify(body)), body);
  const image = body
    .flatMap((n) => [n, ...(n.children ?? [])])
    .find((n) => n?.name === 'Image');
  assert.equal(image.attributes.src, '/images/pages/about/uses/desk-2023.png');
});

test('listProjects with featuredOnly drops unfeatured projects and sorts newest first', async () => {
  const all = await listProjects();
  const featured = await listProjects({ featuredOnly: true });
  assert.equal(all.length, 8);
  assert.equal(featured.length, 7);
  assert.ok(!featured.some((p) => p.name.toLowerCase().includes('rogue')));
  const dates = featured.map((p) => p.publish_date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test('home and global singletons load', async () => {
  assert.ok((await getHome()).typed_words.length > 0);
  assert.equal(
    (await getGlobal()).thumbnail.src,
    '/images/site/thumbnail/src.png',
  );
});

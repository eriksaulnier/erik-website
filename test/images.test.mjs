import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveImages } from '../lib/images.mjs';

test('resolveImages fills in size and blur for nested image objects and keeps alt', async () => {
  const data = {
    blocks: [{ value: { aside_image: { src: '/images/projects/pass-the-aux/thumbnail/src.png', alt: 'Aux' } } }],
    tree: [{ $$mdtype: 'Tag', name: 'Image', attributes: { src: '/images/pages/about/uses/desk-2023.png', alt: 'Desk' } }],
  };
  const out = await resolveImages(data, 'test');
  const img = out.blocks[0].value.aside_image;
  assert.equal(img.alt, 'Aux');
  assert.equal(img.src, '/images/projects/pass-the-aux/thumbnail/src.png');
  assert.ok(img.width > 0 && img.height > 0);
  assert.match(img.blurDataURL, /^data:image\//);
  assert.equal(img.placeholder, 'blur');
  assert.ok(out.tree[0].attributes.width > 0);
});

test('resolveImages leaves empty image objects alone', async () => {
  assert.deepEqual(await resolveImages({ aside_image: {} }, 'test'), { aside_image: {} });
});

test('resolveImages names the entry and field when a file is missing', async () => {
  await assert.rejects(
    resolveImages({ blocks: [{ value: { aside_image: { src: '/images/pages/missing.png', alt: '' } } }] }, 'pages/about'),
    /Image not found: \/images\/pages\/missing\.png in pages\/about at blocks\.0\.value\.aside_image/,
  );
});

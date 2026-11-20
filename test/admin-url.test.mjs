import assert from 'node:assert/strict';
import { test } from 'node:test';
import { adminUrl } from '../lib/admin-url.mjs';

const base = 'http://127.0.0.1:4321/keystatic';

test('home opens the home singleton', () => {
  assert.equal(adminUrl('/'), `${base}/singleton/home`);
});

test('the projects index opens the projects collection', () => {
  assert.equal(adminUrl('/projects'), `${base}/collection/projects`);
});

test('a page opens its entry, with nested slugs encoded', () => {
  assert.equal(adminUrl('/about'), `${base}/collection/pages/item/about`);
  assert.equal(
    adminUrl('/about/uses'),
    `${base}/collection/pages/item/about%2Fuses`,
  );
});

test('query strings and hashes are ignored', () => {
  assert.equal(
    adminUrl('/about?x=1#top'),
    `${base}/collection/pages/item/about`,
  );
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeEmail, encodeEmail } from '../lib/email.mjs';

test('decodeEmail reverses encodeEmail', () => {
  assert.equal(
    decodeEmail(encodeEmail('hello@eriksaulnier.com')),
    'hello@eriksaulnier.com',
  );
});

test('encodeEmail output contains neither the at sign nor the domain', () => {
  const encoded = encodeEmail('hello@eriksaulnier.com');
  assert.ok(!encoded.includes('@'));
  assert.ok(!encoded.includes('eriksaulnier'));
});

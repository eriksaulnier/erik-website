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

test('the Keystatic email field accepts an address and rejects other text', async () => {
  const { default: config } = await import('../keystatic.config.mjs');
  const field = config.singletons.global.schema.footer.fields.email;
  const valid = (value) => {
    try {
      field.validate(value);
      return true;
    } catch {
      return false;
    }
  };
  assert.equal(valid('hello@eriksaulnier.com'), true);
  assert.equal(valid(encodeEmail('hello@eriksaulnier.com')), false);
  assert.equal(valid('hello@例子.com'), false);
  assert.equal(valid(''), false);
});

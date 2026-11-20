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

test('the Keystatic email field rejects a plain address and accepts an encoded one', async () => {
  const { default: config } = await import('../keystatic.config.mjs');
  const field = config.singletons.global.schema.footer.fields.email;
  const parse = (value) => {
    try {
      field.validate(value);
      return true;
    } catch {
      return false;
    }
  };
  assert.equal(parse('hello@eriksaulnier.com'), false);
  assert.equal(parse(encodeEmail('hello@eriksaulnier.com')), true);
});

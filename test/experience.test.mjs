import assert from 'node:assert/strict';
import { test } from 'node:test';
import { companyYears, formatYears } from '../lib/experience.mjs';

test('formatYears shows an open range as "to now"', () => {
  assert.equal(formatYears(2026, null), '2026 to now');
  assert.equal(formatYears(2026, undefined), '2026 to now');
});

test('formatYears shows a closed range, or one year when it starts and ends the same year', () => {
  assert.equal(formatYears(2024, 2026), '2024 to 2026');
  assert.equal(formatYears(2016, 2016), '2016');
});

test('companyYears spans the earliest start to the latest end', () => {
  assert.deepEqual(
    companyYears([
      { start: 2021, end: 2022 },
      { start: 2017, end: 2019 },
    ]),
    { start: 2017, end: 2022 },
  );
});

test('companyYears stays open when any role is current', () => {
  assert.deepEqual(
    companyYears([
      { start: 2026, end: null },
      { start: 2022, end: 2023 },
    ]),
    { start: 2022, end: null },
  );
});

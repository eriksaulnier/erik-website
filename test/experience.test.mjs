import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPage } from '../lib/content.mjs';
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

test('companyYears rejects a company with no roles', () => {
  assert.throws(() => companyYears([]), /at least one role/);
});

test('the about page has its Experience as an experience block', async () => {
  const page = await getPage('about');
  const blocks = page.blocks.filter((b) => b.discriminant === 'experience');
  assert.equal(blocks.length, 1);
  assert.ok(
    !page.blocks.some(
      (b) => b.discriminant === 'content' && b.value.title === 'Experience',
    ),
  );

  const { title, companies } = blocks[0].value;
  assert.equal(title, 'Experience');
  assert.deepEqual(
    companies.map((c) => [c.name, c.url, c.roles.length]),
    [
      ['Traackr', 'https://www.traackr.com/', 4],
      ['Troy Web Consulting', 'https://www.troyweb.com', 3],
      ['1st Playable Productions', 'https://1stplayable.com', 1],
    ],
  );
  assert.deepEqual(companies[0].roles[0], {
    title: 'Staff Engineer',
    start: 2026,
    end: null,
    note: '',
  });
  assert.deepEqual(companies[1].roles[2], {
    title: 'Part-Time Developer',
    start: 2017,
    end: 2019,
    note: 'while at RPI',
  });
  assert.deepEqual(companies[2].roles[0], {
    title: 'Seasonal Programmer',
    start: 2016,
    end: 2016,
    note: '',
  });
});

test('every experience role has a title and a start year no later than its end', async () => {
  const page = await getPage('about');
  const { companies } = page.blocks.find(
    (b) => b.discriminant === 'experience',
  ).value;
  for (const role of companies.flatMap((c) => c.roles)) {
    assert.ok(role.title, 'role has a title');
    assert.ok(Number.isInteger(role.start), `${role.title} has a start year`);
    if (role.end !== null) assert.ok(role.start <= role.end, role.title);
  }
});

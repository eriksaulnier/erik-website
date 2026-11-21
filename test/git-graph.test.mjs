import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createGitGraph,
  LIFE_MS,
  resizeGitGraph,
  stepGitGraph,
} from '../components/splash/git-graph.mjs';

const FRAME = 1 / 60;
const idle = { x: 0, y: 0, vx: 0, vy: 0, active: false };
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};
const run = (g, seconds, pointer = idle) => {
  for (let i = 0; i < Math.round(seconds / FRAME); i++) {
    stepGitGraph(
      g,
      FRAME,
      typeof pointer === 'function' ? pointer(i) : pointer,
    );
  }
};

test('one step never advances more than MAX_DT', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(1) });
  stepGitGraph(g, 30, idle);
  assert.equal(g.time, 50);
});

test('HEAD follows an active pointer without overshoot', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(2) });
  const pointer = { x: 600, y: 300, vx: 0, vy: 0, active: true };
  let prev = g.head.x;
  for (let i = 0; i < 120; i++) {
    stepGitGraph(g, FRAME, pointer);
    assert.ok(g.head.x >= prev, `head.x went back at frame ${i}`);
    assert.ok(g.head.x <= 600, `head.x overshot to ${g.head.x}`);
    prev = g.head.x;
  }
});

test('going idle continues from HEAD, in its heading', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(3) });
  run(g, 0.5, (i) => ({
    x: 200 + 600 * i * FRAME,
    y: 300,
    vx: 600,
    vy: 0,
    active: true,
  }));
  assert.equal(g.ghost, null);
  const before = { ...g.head };
  stepGitGraph(g, FRAME, idle);
  assert.ok(
    Math.hypot(g.ghost.x - before.x, g.ghost.y - before.y) < 3,
    'ghost did not start at HEAD',
  );
  assert.ok(Math.abs(g.ghost.ang - Math.atan2(before.vy, before.vx)) < 0.2);
});

test('points and commits older than LIFE_MS are removed', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(4) });
  run(g, 10);
  assert.ok(g.main.pts.length > 0);
  for (const p of [...g.main.pts, ...g.main.commits]) {
    assert.ok(g.time - p.t <= LIFE_MS);
  }
});

test('reduced motion: nothing moves on its own', () => {
  const g = createGitGraph({
    width: 800,
    height: 600,
    random: seeded(5),
    reducedMotion: true,
  });
  const start = { ...g.head };
  run(g, 10);
  assert.ok(Math.hypot(g.head.x - start.x, g.head.y - start.y) < 1);
  assert.equal(g.branches.length, 0);
});

test('a zero-size card produces no NaN and recovers', () => {
  const g = createGitGraph({ width: 0, height: 0, random: seeded(6) });
  const finite = () =>
    assert.ok(Number.isFinite(g.head.x) && Number.isFinite(g.head.y));
  for (let i = 0; i < 60; i++) {
    stepGitGraph(g, FRAME, idle);
    finite();
  }
  resizeGitGraph(g, 800, 600);
  for (let i = 0; i < 60; i++) {
    stepGitGraph(g, FRAME, idle);
    finite();
  }
  assert.ok(g.main.pts.length > 0, 'the graph did not resume after resize');
});

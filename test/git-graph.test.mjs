import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BACK_SPEED_CAP,
  commitGitGraph,
  createGitGraph,
  LIFE_MS,
  MAX_LIVE,
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

const live = (g) => g.branches.filter((b) => b.state !== 'merged');
const atHead = (g, vx = 0) => ({
  x: g.head.x,
  y: g.head.y,
  vx,
  vy: 0,
  active: true,
});

test('a fast flick forks a branch', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(7) });
  stepGitGraph(g, FRAME, atHead(g, 2500));
  assert.equal(g.branches.length, 1);
  assert.ok(Math.hypot(g.branches[0].vx, g.branches[0].vy) <= 600);
});

test('branches merge back and never exceed MAX_LIVE', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(8) });
  let merged = false;
  for (let i = 0; i < 20 * 60; i++) {
    stepGitGraph(g, FRAME, atHead(g, i % 30 === 0 ? 2500 : 0));
    assert.ok(live(g).length <= MAX_LIVE, `${live(g).length} live branches`);
    if (g.main.commits.some((c) => c.merge)) merged = true;
  }
  assert.ok(merged, 'no branch ever merged');
});

test('a huge hidden gap keeps branch speed under the cap', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(9) });
  stepGitGraph(g, FRAME, atHead(g, 2500));
  stepGitGraph(g, 30, idle);
  for (let i = 0; i < 300; i++) {
    stepGitGraph(g, FRAME, idle);
    for (const b of live(g)) {
      assert.ok(Math.hypot(b.vx, b.vy) <= BACK_SPEED_CAP + 1e-9);
    }
  }
});

test('shrinking the card brings HEAD and branches back inside', () => {
  const g = createGitGraph({ width: 1200, height: 800, random: seeded(10) });
  run(g, 3, (i) => ({
    x: 1100,
    y: 700,
    vx: i % 30 === 0 ? 2500 : 0,
    vy: 0,
    active: true,
  }));
  resizeGitGraph(g, 400, 300);
  run(g, 6);
  const inside = (p) => p.x >= 0 && p.x <= 400 && p.y >= 0 && p.y <= 300;
  assert.ok(inside(g.head), `head at ${g.head.x}, ${g.head.y}`);
  for (const b of live(g)) assert.ok(inside(b), `branch at ${b.x}, ${b.y}`);
});

test('a click commit adds a big commit and a message floater', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(11) });
  stepGitGraph(g, FRAME, idle);
  commitGitGraph(g);
  assert.equal(g.main.commits.at(-1).big, true);
  assert.match(g.floaters[0].text, /^[0-9a-f]{7} {2}\S/);
});

test('reduced motion: branches hold still once the pointer stops', () => {
  const g = createGitGraph({
    width: 800,
    height: 600,
    random: seeded(12),
    reducedMotion: true,
  });
  stepGitGraph(g, FRAME, atHead(g, 2500));
  assert.equal(g.branches.length, 1);
  const before = { x: g.branches[0].x, y: g.branches[0].y };
  run(g, 1);
  const b = g.branches[0];
  assert.ok(Math.hypot(b.x - before.x, b.y - before.y) < 1, 'branch moved');
});

test('branches still merge when HEAD rests at an edge', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(1) });
  const edge = (vx = 0) => ({ x: 2, y: 300, vx, vy: 0, active: true });
  run(g, 1, edge());
  stepGitGraph(g, FRAME, edge(2500));
  assert.equal(g.branches.length, 1);
  let merged = false;
  for (let i = 0; i < 6 * 60 && !merged; i++) {
    stepGitGraph(g, FRAME, edge());
    merged = g.branches[0].state === 'merged';
  }
  assert.ok(merged, 'the branch never merged into HEAD at the edge');
});

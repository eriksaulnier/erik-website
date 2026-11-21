// Pure simulation for the homepage git graph. No DOM or canvas access, so node --test can drive it.
// All ages use state.time, which advances only by the clamped frame delta, never the wall clock,
// so a hidden tab cannot build up a time jump.

export const MAX_DT = 0.05;
export const LIFE_MS = 6000;
export const MAX_LIVE = 5;
export const BACK_SPEED_CAP = 1400;

const SPRING = 9;
const POINT_SPACING = 4;
const MAIN_COMMIT_SPACING = 90;
const FLOATER_MS = 2200;
const GHOST_SPEED = 120;
const GHOST_MARGIN = 90;
const AVOID_PAD = 40;
const FLICK_SPEED = 1800;
const FORK_GAP_MS = 450;
const IDLE_FORK_GAP_MS = 2600;
const FORK_SPEED_CAP = 600;
const OUT_SPEED = 220;
const MERGE_DISTANCE = 16;
const EDGE = 30;
const BRANCH_COMMIT_SPACING = 80;

export const COLORS = [
  '#fcc419',
  '#ff8787',
  '#63e6be',
  '#e599f7',
  '#ffa94d',
  '#a9e34b',
];
export const NAMES = [
  'feat/dark-mode',
  'fix/typo',
  'spike/webgl',
  'chore/deps',
  'feat/konami-code',
  'refactor/all-of-it',
  'hotfix/friday-deploy',
  'feat/cat-gifs',
  'fix/the-fix',
];
export const MESSAGES = [
  'fix typo',
  'wip',
  'it works on my machine',
  'add tests (finally)',
  'remove console.log',
  'refactor everything',
  'bump deps',
  'please work',
  'actually fix typo',
  'ship it',
];

export function createGitGraph({
  width,
  height,
  random = Math.random,
  reducedMotion = false,
}) {
  return {
    time: 0,
    width,
    height,
    random,
    reducedMotion,
    head: { x: width / 2, y: height / 2, vx: 0, vy: 0, dist: 0 },
    ghost: null,
    activity: 0,
    main: { color: '#ffffff', pts: [], commits: [] },
    branches: [],
    floaters: [],
    lastFork: Number.NEGATIVE_INFINITY,
    avoid: null,
    colorIndex: 0,
  };
}

const clampInto = (p, w, h) => {
  p.x = Math.min(Math.max(p.x, 0), w);
  p.y = Math.min(Math.max(p.y, 0), h);
};

export function resizeGitGraph(state, width, height) {
  state.width = width;
  state.height = height;
  // Pull everything inside the new card, or a shrink strands HEAD and branches off-screen.
  clampInto(state.head, width, height);
  if (state.ghost) clampInto(state.ghost, width, height);
  for (const b of state.branches) clampInto(b, width, height);
}

export function setAvoidRect(state, rect) {
  state.avoid = rect;
}

const pick = (random, list) => list[Math.floor(random() * list.length)];

export function commitGitGraph(state) {
  const { head, time, random } = state;
  const id = hash(random);
  state.main.commits.push({
    x: head.x,
    y: head.y,
    t: time,
    big: true,
    hash: id,
  });
  state.floaters.push({
    x: head.x + 12,
    y: head.y - 12,
    t: time,
    text: `${id}  ${pick(random, MESSAGES)}`,
    color: '#fff',
  });
}

function fork(state, vx, vy) {
  const { head, time, random } = state;
  const speed = Math.hypot(vx, vy);
  const scale = speed > FORK_SPEED_CAP ? FORK_SPEED_CAP / speed : 1;
  state.lastFork = time;
  state.main.commits.push({
    x: head.x,
    y: head.y,
    t: time,
    hash: hash(random),
  });
  state.branches.push({
    x: head.x,
    y: head.y,
    vx: vx * scale,
    vy: vy * scale,
    color: COLORS[state.colorIndex++ % COLORS.length],
    name: pick(random, NAMES),
    born: time,
    outFor: 1 + random() * 1.1,
    seed: random() * 100,
    state: 'out',
    pts: [{ x: head.x, y: head.y, t: time }],
    commits: [],
    dist: 0,
  });
}

function maybeFork(state, pointer) {
  const { time, head, random } = state;
  const liveCount = state.branches.filter((b) => b.state !== 'merged').length;
  if (time - state.lastFork <= FORK_GAP_MS || liveCount >= MAX_LIVE) return;
  if (pointer.active) {
    if (Math.hypot(pointer.vx, pointer.vy) > FLICK_SPEED) {
      fork(state, pointer.vx * 0.4, pointer.vy * 0.4);
    }
  } else if (!state.reducedMotion && time - state.lastFork > IDLE_FORK_GAP_MS) {
    const side = random() < 0.5 ? 1 : -1;
    fork(
      state,
      -head.vy * side * 0.8 + (random() - 0.5) * 120,
      head.vx * side * 0.8 + (random() - 0.5) * 120,
    );
  }
}

function moveBranch(state, b, dt) {
  const { head, time } = state;
  const age = (time - b.born) / 1000;
  if (b.state === 'out') {
    const turn = Math.sin(time / 280 + b.seed) * 2 * dt;
    const c = Math.cos(turn);
    const s = Math.sin(turn);
    [b.vx, b.vy] = [b.vx * c - b.vy * s, b.vx * s + b.vy * c];
    const speed = Math.hypot(b.vx, b.vy) || 1;
    const next = speed + (OUT_SPEED - speed) * (1 - Math.exp(-dt * 1.4));
    b.vx *= next / speed;
    b.vy *= next / speed;
    if (age > b.outFor) b.state = 'back';
  } else {
    const dx = head.x - b.x;
    const dy = head.y - b.y;
    const d = Math.hypot(dx, dy) || 1;
    const want = Math.min(BACK_SPEED_CAP, 340 + (age - b.outFor) * 500);
    const k = 1 - Math.exp(-dt * 3.5);
    b.vx += ((dx / d) * want - b.vx) * k;
    b.vy += ((dy / d) * want - b.vy) * k;
    if (d < MERGE_DISTANCE) {
      b.state = 'merged';
      addPoint(b, head.x, head.y, time);
      state.main.commits.push({
        x: head.x,
        y: head.y,
        t: time,
        merge: true,
        color: b.color,
      });
      state.floaters.push({
        x: head.x + 12,
        y: head.y - 12,
        t: time,
        text: `Merge '${b.name}'`,
        color: b.color,
      });
      return;
    }
  }
  // Only outbound branches bounce. A returning branch heads for HEAD, which may sit at the edge.
  const { width: w, height: h } = state;
  if (b.state === 'out') {
    if ((b.x < EDGE && b.vx < 0) || (b.x > w - EDGE && b.vx > 0)) b.vx *= -1;
    if ((b.y < EDGE && b.vy < 0) || (b.y > h - EDGE && b.vy > 0)) b.vy *= -1;
  }
  const ox = b.x;
  const oy = b.y;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.dist += Math.hypot(b.x - ox, b.y - oy);
  addPoint(b, b.x, b.y, time);
  if (b.dist > BRANCH_COMMIT_SPACING) {
    b.dist = 0;
    b.commits.push({ x: b.x, y: b.y, t: time });
  }
}

function hash(random) {
  return Math.floor(random() * 0xfffffff)
    .toString(16)
    .padStart(7, '0');
}

function addPoint(path, x, y, t) {
  const last = path.pts[path.pts.length - 1];
  if (!last || Math.hypot(x - last.x, y - last.y) > POINT_SPACING) {
    path.pts.push({ x, y, t });
  }
}

function expire(list, time, life) {
  while (list.length && time - list[0].t > life) list.shift();
}

function wander(state, dt) {
  const { head } = state;
  if (!state.ghost) {
    const speed = Math.hypot(head.vx, head.vy);
    state.ghost = {
      x: head.x,
      y: head.y,
      ang:
        speed > 5 ? Math.atan2(head.vy, head.vx) : state.random() * Math.PI * 2,
      seed: state.random() * 100,
    };
  }
  const g = state.ghost;
  g.ang += Math.sin(state.time / 1100 + g.seed) * 0.9 * dt;
  const { width: w, height: h, avoid: a } = state;
  const turnToward = (target, rate) => {
    const diff = Math.atan2(Math.sin(target - g.ang), Math.cos(target - g.ang));
    g.ang += diff * Math.min(1, dt * rate);
  };
  // With a heading to avoid, "home" is the middle of the free area on the ghost's side of it,
  // so the edge rule never steers the ghost back into the heading.
  const above = a && g.y < a.y + a.h / 2;
  const homeY = !a ? h / 2 : above ? a.y / 2 : (a.y + a.h + h) / 2;
  if (
    g.x < GHOST_MARGIN ||
    g.x > w - GHOST_MARGIN ||
    g.y < GHOST_MARGIN ||
    g.y > h - GHOST_MARGIN
  ) {
    turnToward(Math.atan2(homeY - g.y, w / 2 - g.x), 1.6);
  }
  if (
    a &&
    g.x > a.x - AVOID_PAD &&
    g.x < a.x + a.w + AVOID_PAD &&
    g.y > a.y - AVOID_PAD &&
    g.y < a.y + a.h + AVOID_PAD
  ) {
    turnToward(above ? -Math.PI / 2 : Math.PI / 2, 4);
  }
  g.x += Math.cos(g.ang) * GHOST_SPEED * dt;
  g.y += Math.sin(g.ang) * GHOST_SPEED * dt;
  return g;
}

function moveHead(state, dt, pointer) {
  const { head } = state;
  let target;
  if (pointer.active) {
    state.ghost = null;
    target = pointer;
  } else if (state.reducedMotion) {
    target = head;
  } else {
    target = wander(state, dt);
  }
  // Critically damped spring: HEAD eases in without overshoot or kinks.
  head.vx +=
    ((target.x - head.x) * SPRING * SPRING - head.vx * 2 * SPRING) * dt;
  head.vy +=
    ((target.y - head.y) * SPRING * SPRING - head.vy * 2 * SPRING) * dt;
  const ox = head.x;
  const oy = head.y;
  head.x += head.vx * dt;
  head.y += head.vy * dt;
  head.dist += Math.hypot(head.x - ox, head.y - oy);
}

export function stepGitGraph(state, dt, pointer) {
  const step = Math.min(Math.max(dt, 0), MAX_DT);
  state.time += step * 1000;
  const { time } = state;

  const rate = pointer.active ? 4 : 0.8;
  state.activity +=
    ((pointer.active ? 1 : 0) - state.activity) * (1 - Math.exp(-step * rate));

  if (state.width > 0 && state.height > 0) {
    moveHead(state, step, pointer);
    const { head, main } = state;
    addPoint(main, head.x, head.y, time);
    if (head.dist > MAIN_COMMIT_SPACING) {
      head.dist = 0;
      main.commits.push({
        x: head.x,
        y: head.y,
        t: time,
        hash: hash(state.random),
      });
    }
    maybeFork(state, pointer);
    // Under reduced motion the graph moves only while the visitor does.
    const frozen = state.reducedMotion && !pointer.active;
    for (const b of state.branches) {
      if (b.state !== 'merged' && !frozen) moveBranch(state, b, step);
    }
  }

  expire(state.main.pts, time, LIFE_MS);
  expire(state.main.commits, time, LIFE_MS);
  expire(state.floaters, time, FLOATER_MS);
  for (const b of state.branches) {
    expire(b.pts, time, LIFE_MS);
    expire(b.commits, time, LIFE_MS);
  }
  state.branches = state.branches.filter(
    (b) => b.state !== 'merged' || b.pts.length > 1,
  );
}

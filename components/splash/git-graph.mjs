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
    lastFork: 0,
  };
}

export function resizeGitGraph(state, width, height) {
  state.width = width;
  state.height = height;
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
  const { width: w, height: h } = state;
  if (
    g.x < GHOST_MARGIN ||
    g.x > w - GHOST_MARGIN ||
    g.y < GHOST_MARGIN ||
    g.y > h - GHOST_MARGIN
  ) {
    const toCenter = Math.atan2(h / 2 - g.y, w / 2 - g.x);
    const diff = Math.atan2(
      Math.sin(toCenter - g.ang),
      Math.cos(toCenter - g.ang),
    );
    g.ang += diff * Math.min(1, dt * 1.6);
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
  }

  expire(state.main.pts, time, LIFE_MS);
  expire(state.main.commits, time, LIFE_MS);
  expire(state.floaters, time, FLOATER_MS);
}

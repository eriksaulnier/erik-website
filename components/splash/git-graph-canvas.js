import { useEffect, useRef } from 'react';
import {
  commitGitGraph,
  createGitGraph,
  LIFE_MS,
  MAX_DT,
  resizeGitGraph,
  setAvoidRect,
  stepGitGraph,
} from './git-graph.mjs';
import styles from './splash.module.scss';

const BG = '#1e2021';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const ACTIVE_MS = 2500;
const TAP_SLOP = 6;
const NARROW = 600;

export default function GitGraph({ clearRefs }) {
  const canvasRef = useRef(null);
  // Splash passes a new array each render. A ref keeps the effect from restarting the graph.
  const clearRefsRef = useRef(clearRefs);
  clearRefsRef.current = clearRefs;

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Without hover the graph is idle most of the time, so it must not sit at half strength.
    const touchQuery = window.matchMedia('(hover: none)');
    let dpr = 1;
    const state = createGitGraph({
      width: card.clientWidth,
      height: card.clientHeight,
      reducedMotion: motionQuery.matches,
    });
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    let inside = false;
    let lastMove = Number.NEGATIVE_INFINITY;
    let lastEvent = 0;
    let press = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = card.clientWidth;
      const h = card.clientHeight;
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      resizeGitGraph(state, w, h);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(card);

    const local = (e) => {
      const r = card.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, r };
    };
    const onMove = (e) => {
      const now = performance.now();
      const { x, y, r } = local(e);
      const isInside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside && isInside) {
        const dt = Math.max(1, now - lastEvent) / 1000;
        pointer.vx = pointer.vx * 0.65 + ((x - pointer.x) / dt) * 0.35;
        pointer.vy = pointer.vy * 0.65 + ((y - pointer.y) / dt) * 0.35;
      }
      pointer.x = x;
      pointer.y = y;
      lastEvent = now;
      inside = isInside;
      if (isInside) lastMove = now;
    };
    // A touch has no hover moves, so the press itself moves the pointer. Starting from the last
    // touch position would read as a huge flick and fork a branch on every new touch.
    const onDown = (e) => {
      const { x, y } = local(e);
      press = { x, y };
      pointer.x = x;
      pointer.y = y;
      pointer.vx = 0;
      pointer.vy = 0;
      lastEvent = performance.now();
      lastMove = lastEvent;
      inside = true;
    };
    const onCancel = () => {
      press = null;
    };
    const onUp = (e) => {
      const { x, y } = local(e);
      if (press && Math.hypot(x - press.x, y - press.y) < TAP_SLOP) {
        commitGitGraph(state);
      }
      press = null;
    };
    const onMotionChange = () => {
      state.reducedMotion = motionQuery.matches;
    };

    let frame = 0;
    let last = performance.now();
    // The first frame after a hidden tab is one normal step, not the whole time away.
    const onVisibility = () => {
      if (!document.hidden) last = performance.now();
    };
    const loop = (now) => {
      const dt = Math.min(Math.max(now - last, 0) / 1000, MAX_DT);
      last = now;
      const decay = Math.exp(-dt * 6);
      pointer.vx *= decay;
      pointer.vy *= decay;
      pointer.active = inside && performance.now() - lastMove < ACTIVE_MS;
      const heading = unionRect(cardRects(card, clearRefsRef.current));
      setAvoidRect(state, heading);
      stepGitGraph(state, dt, pointer);
      drawGitGraph(ctx, state, {
        dpr,
        heading,
        idleFloor: touchQuery.matches ? 0.8 : 0.5,
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove);
    card.addEventListener('pointerdown', onDown);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onCancel);
    motionQuery.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerdown', onDown);
      card.removeEventListener('pointerup', onUp);
      card.removeEventListener('pointercancel', onCancel);
      motionQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // The wrapper carries aria-hidden: Biome treats a bare canvas as interactive and rejects it there.
  return (
    <div className={styles.background} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

function cardRects(card, refs) {
  const base = card.getBoundingClientRect();
  return (refs || [])
    .map((ref) => ref?.current?.getBoundingClientRect())
    .filter(Boolean)
    .map((r) => ({
      x: r.left - base.left,
      y: r.top - base.top,
      w: r.width,
      h: r.height,
    }));
}

function unionRect(rects) {
  if (!rects.length) return null;
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  const w = Math.max(...rects.map((r) => r.x + r.w)) - x;
  const h = Math.max(...rects.map((r) => r.y + r.h)) - y;
  return { x, y, w, h };
}

// Keeps a label inside the card, so names near the right edge are not cut off.
function fitText(ctx, text, x, y, width) {
  const max = width - ctx.measureText(text).width - 4;
  ctx.fillText(text, Math.max(4, Math.min(x, max)), y);
}

function drawGitGraph(ctx, state, { dpr, heading, idleFloor }) {
  const { time, main, branches, floaters, width } = state;
  const soft = idleFloor + (1 - idleFloor) * state.activity;
  const fade = (t) => Math.max(0, 1 - (time - t) / LIFE_MS) ** 0.6;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (const b of branches) drawPath(ctx, b.pts, b.color, fade, soft);
  drawPath(ctx, main.pts, main.color, fade, soft);
  for (const b of branches) {
    for (const c of b.commits) {
      drawCommit(ctx, c, b.color, fade, soft, time, width);
    }
  }
  for (const c of main.commits) {
    drawCommit(ctx, c, main.color, fade, soft, time, width, true);
  }

  ctx.font = `11px ${MONO}`;
  for (const b of branches) {
    if (b.state === 'merged') continue;
    ctx.globalAlpha = soft;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7 * soft;
    fitText(ctx, b.name, b.x + 9, b.y - 9, width);
  }
  const { head } = state;
  ctx.globalAlpha = soft;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(head.x, head.y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BG;
  ctx.beginPath();
  ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.55 * soft;
  ctx.fillStyle = '#fff';
  fitText(ctx, 'HEAD -> main', head.x + 12, head.y + 20, width);

  ctx.font = `12px ${MONO}`;
  for (const f of floaters) {
    const age = (time - f.t) / 1000;
    ctx.globalAlpha =
      Math.min(1, (2.2 - age) / 0.7) * Math.min(1, age * 6) * 0.85 * soft;
    ctx.fillStyle = f.color;
    fitText(ctx, f.text, f.x, f.y - age * 18, width);
  }
  ctx.globalAlpha = 1;

  if (heading) clearZone(ctx, heading, width < NARROW);
}

// Quadratic curves through the midpoints, so the sampled trail reads as one smooth stroke.
function drawPath(ctx, pts, color, fade, soft) {
  if (pts.length < 3) return;
  ctx.strokeStyle = color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'butt';
  for (const [width, alpha] of [
    [7, 0.07],
    [1.75, 0.8],
  ]) {
    ctx.lineWidth = width;
    for (let i = 1; i < pts.length - 1; i += 6) {
      const end = Math.min(i + 6, pts.length - 1);
      ctx.globalAlpha = fade(pts[i].t) * alpha * soft;
      ctx.beginPath();
      ctx.moveTo((pts[i - 1].x + pts[i].x) / 2, (pts[i - 1].y + pts[i].y) / 2);
      for (let m = i; m < end; m++) {
        ctx.quadraticCurveTo(
          pts[m].x,
          pts[m].y,
          (pts[m].x + pts[m + 1].x) / 2,
          (pts[m].y + pts[m + 1].y) / 2,
        );
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function drawCommit(ctx, c, color, fade, soft, time, width, withHash = false) {
  const alpha = fade(c.t) * 0.85 * soft;
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.merge ? 5 : c.big ? 6.5 : 3.5, 0, Math.PI * 2);
  ctx.fillStyle = c.merge ? c.color : BG;
  ctx.fill();
  ctx.strokeStyle = c.merge ? '#fff' : color;
  ctx.lineWidth = 1.75;
  ctx.stroke();
  const age = (time - c.t) / 1000;
  if (withHash && c.hash && age < 2) {
    ctx.globalAlpha = alpha * 0.5 * (1 - age / 2);
    ctx.fillStyle = '#fff';
    ctx.font = `10px ${MONO}`;
    fitText(ctx, c.hash, c.x + 9, c.y + 4, width);
  }
  ctx.globalAlpha = 1;
}

// A soft elliptical hole behind the heading, so the graph never fights the text. On a narrow
// card the heading spans the full width, so the hole is tighter and lighter or it erases the band.
function clearZone(ctx, { x, y, w, h }, narrow) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.translate(x + w / 2, y + h / 2);
  ctx.scale(w / 2 + (narrow ? 24 : 70), h / 2 + (narrow ? 36 : 60));
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(0,0,0,${narrow ? 0.7 : 0.85})`);
  g.addColorStop(0.7, `rgba(0,0,0,${narrow ? 0.6 : 0.75})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

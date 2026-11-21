# Git Graph Splash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage tsParticles background with the interactive git graph from the approved prototype, and damp the jittery heading entry spring.

**Architecture:** A pure simulation module (`git-graph.mjs`) holds all state and the update step, with no DOM access, so `node --test` covers it. A React component (`git-graph.js`) owns the canvas, the frame loop, the pointer input and the drawing. `splash.js` renders the component in place of `Particles`.

**Tech Stack:** Next.js 13.3.1 (Pages Router, static export), React 18, Framer Motion 10, canvas 2D, `node:test`, Biome.

**Spec:** `docs/designs/git-graph-splash.md`. The behavior reference is `docs/designs/git-graph-splash-prototype.html`, function `makeGit` (tab "2 · Git v2 (polished)"). When a value below and the prototype disagree, the value below wins.

## Global Constraints

- No new runtime dependency. Remove `react-tsparticles` and `tsparticles-slim`.
- A module imported by tests MUST be `.mjs`. Tests live in `test/*.test.mjs` and use `node:test` and `node:assert/strict`.
- Biome style: 2-space indent, single quotes, semicolons. `mise run lint` MUST pass.
- The canvas MUST start only inside `useEffect`, because the site is a static export.
- Simulation time MUST come only from the clamped frame delta: `MAX_DT = 0.05` seconds. The wall clock MUST NOT enter the simulation.
- The canvas backing size is `size × min(devicePixelRatio, 2)`.
- Commit-fill color is `$dark-2`, `#1e2021`. The monospace font stack is `ui-monospace, SFMono-Regular, Menlo, monospace`, because the site loads no mono web font.
- Before each commit, run the `cleanup-comments` skill over the staged diff. Commit messages use Conventional Commits and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A card of size 0**, as during mount or a hidden layout. The simulation MUST NOT produce `NaN` and MUST recover when a real size arrives. Test in Task 1.
2. **The card shrinks while the graph runs.** `HEAD` and branches MUST come back inside the new bounds within a few seconds. Test in Task 2.
3. **A long hidden gap passed as one huge delta.** One step MUST advance at most 50 ms, and branch speed MUST stay at or below 1,400 px/s. Test in Task 2.
4. **Reduced motion with no pointer.** Nothing moves on its own and no branch forks. Test in Task 1.
5. **Heading refs that are null** on the first frame. The clear zone is skipped and nothing throws. Check in Task 3.

---

### Task 1: Simulation core (HEAD, idle wanderer, trail, clock)

**Files:**
- Create: `components/splash/git-graph.mjs`
- Test: `test/git-graph.test.mjs`

**Interfaces:**
- Produces:
  - `export const MAX_DT = 0.05`, `LIFE_MS = 6000`, `MAX_LIVE = 5`, `BACK_SPEED_CAP = 1400`
  - `export function createGitGraph({ width, height, random = Math.random, reducedMotion = false }): GraphState`
  - `export function resizeGitGraph(state: GraphState, width: number, height: number): void`
  - `export function stepGitGraph(state: GraphState, dt: number, pointer: Pointer): void`. `dt` is in seconds and is clamped to `[0, MAX_DT]`. It advances `state.time`, in milliseconds.
  - `export function commitGitGraph(state: GraphState): void`. This is the click commit, written in Task 2.
  - `Pointer = { x, y, vx, vy, active }`. Coordinates are card-local px, velocity is px/s, and `active` is true while the pointer is in the card and moved within the last 2.5 s.
  - `GraphState = { time, width, height, random, reducedMotion, head: { x, y, vx, vy, dist }, ghost: null | { x, y, ang, seed }, activity, main: { color: '#ffffff', pts: Point[], commits: Commit[] }, branches: Branch[], floaters: Floater[], lastFork }`
  - `Point = { x, y, t }`, `Commit = { x, y, t, hash?, merge?, color?, big? }`, `Floater = { x, y, t, text, color }`

- [ ] **Step 1: Write the failing tests** in `test/git-graph.test.mjs`. Use a seeded generator: `const seeded = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);`

```js
test('one step never advances more than MAX_DT', () => {
  const g = createGitGraph({ width: 800, height: 600, random: seeded(1) });
  stepGitGraph(g, 30, idle);
  assert.equal(g.time, 50);
});
test('HEAD follows an active pointer without overshoot', () => {
  // pointer fixed at (600, 300); 120 frames of 1/60
  // assert: head.x increases monotonically and never exceeds 600
});
test('going idle continues from HEAD, in its heading', () => {
  // 30 frames with an active pointer moving right at 600 px/s, then one idle step
  // assert: distance(ghost before its first move, head) < 3
  // assert: |ghost.ang - atan2(head.vy, head.vx)| < 0.2
});
test('points and commits older than LIFE_MS are removed', () => {
  // 10 s of idle frames; assert every main point and commit has time - t <= 6000
});
test('reduced motion: nothing moves on its own', () => {
  // reducedMotion: true, 10 s of idle frames
  // assert: head moved < 1 px, branches.length === 0
});
test('a zero-size card produces no NaN and recovers', () => {
  // width 0, height 0, 60 idle frames; then resizeGitGraph(g, 800, 600) and 60 more
  // assert: Number.isFinite(head.x) && Number.isFinite(head.y) throughout
});
```

`const idle = { x: 0, y: 0, vx: 0, vy: 0, active: false };`

- [ ] **Step 2: Run the tests to verify that they fail**

Run: `node --test test/git-graph.test.mjs`
Expected: FAIL, with a module-not-found error for `components/splash/git-graph.mjs`.

- [ ] **Step 3: Implement `createGitGraph`, `resizeGitGraph` and the core of `stepGitGraph`** with these values from the prototype:
  - The `HEAD` spring is critically damped with ω = 9: `v += ((target - p)·ω² − v·2ω)·dt`.
  - The target is the pointer when `active`. Otherwise it is the ghost. With `reducedMotion` and no active pointer, the target is `HEAD` itself, with no ghost.
  - The ghost is created on the first idle step at `HEAD`'s position. Its angle is `atan2(head.vy, head.vx)` when the speed is > 5, otherwise a random angle, and its `seed` is `random() * 100`. Each step: `ang += sin(time/1100 + seed)·0.9·dt`. Inside a 90 px margin, it turns toward the card center by the wrapped angle difference × `min(1, dt·1.6)`. It moves at 120 px/s. An active pointer resets the ghost to `null`.
  - `activity` eases toward 1 with `1 − exp(−4·dt)` while active, and toward 0 with `1 − exp(−0.8·dt)` while idle.
  - Add a point to `main` when `HEAD` has moved > 4 px since the last point. Add a commit with a `hash` every 90 px of travel. `hash = Math.floor(random() * 0xfffffff).toString(16).padStart(7, '0')`.
  - Expire points, commits and floaters by `state.time − t`: `LIFE_MS` for points and commits, 2,200 ms for floaters.
  - With a zero or negative size, skip the motion and keep the clock running.

- [ ] **Step 4: Run the tests to verify that they pass**

Run: `node --test test/git-graph.test.mjs`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add components/splash/git-graph.mjs test/git-graph.test.mjs
git commit -m "feat: add the git graph simulation core"
```

### Task 2: Branches, merges and click commits

**Files:**
- Modify: `components/splash/git-graph.mjs`
- Test: `test/git-graph.test.mjs`

**Interfaces:**
- Consumes: everything from Task 1.
- Produces:
  - `Branch = { x, y, vx, vy, color, name, born, outFor, seed, state: 'out' | 'back' | 'merged', pts: Point[], commits: Commit[], dist }`
  - `export const COLORS = ['#fcc419', '#ff8787', '#63e6be', '#e599f7', '#ffa94d', '#a9e34b']`
  - `export const NAMES = ['feat/dark-mode', 'fix/typo', 'spike/webgl', 'chore/deps', 'feat/konami-code', 'refactor/all-of-it', 'hotfix/friday-deploy', 'feat/cat-gifs', 'fix/the-fix']`
  - `export const MESSAGES = ['fix typo', 'wip', 'it works on my machine', 'add tests (finally)', 'remove console.log', 'refactor everything', 'bump deps', 'please work', 'actually fix typo', 'ship it']`
  - `commitGitGraph(state)` pushes `{ x: head.x, y: head.y, t: time, big: true, hash }` to `main.commits` and a floater at `(head.x + 12, head.y − 12)` with the text `` `${hash}  ${message}` `` in `#fff`.

- [ ] **Step 1: Write the failing tests**

```js
test('a fast flick forks a branch', () => {
  // active pointer with vx = 2500; one step
  // assert: branches.length === 1, branch speed <= 600
});
test('branches merge back and never exceed MAX_LIVE', () => {
  // 20 s: every 0.5 s one frame with an active flick (vx = 2500), otherwise the pointer is active at HEAD
  // assert after every step: live branches (state !== 'merged') <= 5
  // assert at the end: main.commits.some((c) => c.merge)
});
test('a huge hidden gap keeps branch speed under the cap', () => {
  // fork a branch, then stepGitGraph(g, 30, idle), then 300 frames of 1/60 idle
  // assert after every frame: every live branch has hypot(vx, vy) <= BACK_SPEED_CAP
});
test('shrinking the card brings HEAD and branches back inside', () => {
  // 3 s with forks at 1200x800, then resizeGitGraph(g, 400, 300) and 6 s idle
  // assert: head and every live branch are within [0, 400] x [0, 300]
});
test('a click commit adds a big commit and a message floater', () => {
  // commitGitGraph(g)
  // assert: the last main commit is big, and floaters[0].text matches /^[0-9a-f]{7}  /
});
```

- [ ] **Step 2: Run the tests to verify that they fail**

Run: `node --test test/git-graph.test.mjs`
Expected: the 5 new tests FAIL. The Task 1 tests still PASS.

- [ ] **Step 3: Implement forks, the branch lifecycle and `commitGitGraph`** with these values from the prototype:
  - **Fork rule.** Fork only when `time − lastFork > 450` and fewer than 5 branches are live. With an active pointer, fork when `hypot(vx, vy) > 1800`, at the pointer velocity × 0.4. When idle, and without `reducedMotion`, fork when `time − lastFork > 2600`, at HEAD's velocity turned 90° to a random side × 0.8, plus `(random() − 0.5)·120` on each axis.
  - **Fork setup.** Cap the start speed at 600. Add a hashed commit to `main` at the fork point. The branch gets the next color in turn and a random name. `outFor` is `1 + random()·1.1` seconds.
  - **State `out`.** Turn the velocity by `sin(time/280 + seed)·2·dt`. Ease the speed toward 220 with `1 − exp(−1.4·dt)`. After `outFor`, switch to `back`.
  - **State `back`.** The wanted speed is `min(BACK_SPEED_CAP, 340 + (age − outFor)·500)`, where `age` uses `state.time`. Steer toward `HEAD` with `1 − exp(−3.5·dt)`. Within 16 px of `HEAD`, the branch is `merged`: add `{ merge: true, color }` to `main.commits` and the floater `` `Merge '${name}'` `` in the branch color.
  - **Edges.** Reverse a velocity component that points outward within 30 px of an edge.
  - **Trail.** Points every 4 px, commits every 80 px. Remove merged branches when their points have expired.

- [ ] **Step 4: Run the tests to verify that they pass**

Run: `node --test test/git-graph.test.mjs`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add components/splash/git-graph.mjs test/git-graph.test.mjs
git commit -m "feat: add branches, merges and click commits to the git graph"
```

### Task 3: Canvas component, drawing and splash wiring

**Files:**
- Create: `components/splash/git-graph.js`
- Modify: `components/splash/splash.js`, `components/splash/splash.module.scss`, `package.json`, `pnpm-lock.yaml`
- Delete: `components/splash/particlesjs-config.json`

**Interfaces:**
- Consumes: `createGitGraph`, `resizeGitGraph`, `stepGitGraph`, `commitGitGraph`, `MAX_DT` and the state shape from Tasks 1–2.
- Produces: `export default function GitGraph({ clearRefs }: { clearRefs: React.RefObject<HTMLElement>[] })`, which renders `<canvas aria-hidden="true">`.

- [ ] **Step 1: Remove tsParticles**

Run: `mise exec -- pnpm remove react-tsparticles tsparticles-slim && git rm components/splash/particlesjs-config.json`
Expected: both packages are gone from `package.json`.

- [ ] **Step 2: Write `components/splash/git-graph.js`**
  - **Setup in `useEffect`.** Create the state from the canvas parent's size. Read reduced motion from `matchMedia('(prefers-reduced-motion: reduce)')` and follow its `change` event. A `ResizeObserver` on the parent calls `resizeGitGraph` and sets the backing size. Cleanup cancels the frame, disconnects the observer and removes every listener.
  - **Pointer input.**
    - A `pointermove` listener on `window` converts to card-local coordinates and keeps `inside`.
    - It smooths velocity with `v = v·0.65 + instant·0.35`, and the velocity decays each frame by `exp(−6·dt)`.
    - It records the real time of the last move. `active = inside && performance.now() − lastMove < 2500`.
    - `pointerdown` and `pointerup` go on the canvas parent, because the heading covers the middle of the canvas. A press and release less than 6 px apart calls `commitGitGraph`.
  - **Loop.** Each frame: `dt = min((t − last) / 1000, MAX_DT)`, then step, then draw. On `visibilitychange` back to visible, set `last = performance.now()`.
  - **`drawGitGraph(ctx, state, { dpr, clearRects })`.** This is a module-local function. It draws straight onto the transparent canvas, in this order:
    1. Branch paths, then the main path. Each path is quadratic curves through the point midpoints, in chunks of 6 points with the alpha set per chunk. Draw two passes: width 7 at alpha 0.07, then width 1.75 at alpha 0.8. Multiply both by `fade × soft`, where `fade = max(0, 1 − age/LIFE_MS)^0.6` and `soft = 0.5 + 0.5·activity`.
    2. Commits. The radius is 3.5, or 5 for a merge, or 6.5 for a big commit. The line width is 1.75 and the alpha is `fade·0.85·soft`. A merge commit is filled with its color and has a white ring. Other commits are filled `#1e2021` with a ring in the branch color. A `main` hash shows at 10 px for 2 s, at alpha `0.5·(1 − age/2)`.
    3. Labels. A live branch gets a 3 px head dot and its name at 11 px, alpha 0.7, offset (+9, −9). `HEAD` gets a white dot of radius 5.5 with a `#1e2021` center of radius 2.5, and the label `HEAD -> main` at 11 px, alpha 0.55, offset (+12, +20).
    4. Floaters. 12 px text with alpha `min(1, (2.2 − age)/0.7)·min(1, age·6)·0.85·soft`, rising 18 px/s.
    5. The clear zone. Take the union of the non-null `clearRefs` rects, converted to card coordinates. Use `destination-out` with a radial gradient scaled to radii `(w/2 + 70, h/2 + 60)`. The stops are 0 → 0.85, 0.7 → 0.75 and 1 → 0 alpha. Skip this step when every ref is null.

- [ ] **Step 3: Wire it into `splash.js` and the stylesheet**
  - Remove the `Particles`, `loadSlim`, `particleConfig` and `useCallback` imports and `particlesInit`.
  - Add `useRef` refs on `motion.h1` and `motion.h2`, and render `<GitGraph clearRefs={[headingRef, subheadingRef]} />` where `<Particles>` was.
  - In `splash.module.scss`, change `.splash` `background-color` to `transparent`. Give `.background` `display: block; width: 100%; height: 100%;`, and use it as the canvas class.
  - Keep `.centered` above the canvas, which it already is with `z-index: 1`. Add `pointer-events: none` to `.centered`, so pointer events reach the parent everywhere except links, if any are added later.

- [ ] **Step 4: Verify lint, tests and build**

Run: `mise run lint && mise run test && mise run build`
Expected: Biome reports no errors, all tests pass, and `next build` finishes with the export in `out/`.

- [ ] **Step 5: Verify in a browser**

Run `mise run dev:site`. Then use Orca's browser, or headless Playwright if Orca is unavailable, to check `/`:
- The console has no errors.
- The dark card shows the graph, and the heading area is cleared.
- A drag draws `main`, a flick forks a branch, and a click shows a message.
- After a full navigation to `/about` and back, the graph starts fresh with no errors.
- Emulating `prefers-reduced-motion: reduce` with no pointer input gives a still graph.

- [ ] **Step 6: Commit**

```bash
git add -A components/splash package.json pnpm-lock.yaml
git commit -m "feat: replace the splash particles with the git graph"
```

### Task 4: Damp the heading entry spring

**Files:**
- Modify: `components/splash/splash.js`, the two `transition` objects on the letter `motion.span` and on `motion.h2`

**Interfaces:**
- Consumes: nothing. Produces: nothing.

- [ ] **Step 1: Measure the current motion (the failing check)**

With the dev server running, sample the first letter's inline transform on every frame for 4 s after load, using Playwright's `addInitScript` and `requestAnimationFrame`. Count the sign changes of the `translateY` value.
Expected now: 3 or more sign changes. A peak near −5.2 px follows the +15 px start.

- [ ] **Step 2: Add `damping: 26` to both springs**

Both become `{ type: 'spring', stiffness: 300, damping: 26 }`. The `h2` keeps its `delay: subheadingDelay`.

- [ ] **Step 3: Measure again**

Expected: at most 1 sign change, and the smallest `translateY` is ≥ −0.5 px.

- [ ] **Step 4: Commit**

```bash
git add components/splash/splash.js
git commit -m "fix: damp the splash heading entry spring"
```

### Task 5: Final verification and docs

- [ ] **Step 1:** Run `mise run lint && mise run test && mise run build` on the final commit. Expected: everything passes.
- [ ] **Step 2:** In `docs/designs/git-graph-splash.md`, set **Status** to `Implemented`. Commit the design doc, this plan and the prototype together with `docs: add the git graph splash design and plan`.
- [ ] **Step 3:** Run the pre-push review: `gadfly-review-local` on a model that did not write the code, as the owner's instructions require. Then fix its findings before any push.

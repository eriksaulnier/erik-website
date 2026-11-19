# Reviewing erik-website

This section is erik-website's own. Everything above it holds for any repository.

These rules describe the site after the Cloudflare migration in #7. Until #7 merges, `main` still runs the old Tina and Netlify stack, with `next start`, API routes and S3 images. A pull request against that older code MUST be judged on what its tree contains, and a rule below that names a file the tree does not have does not apply.

## What the site is

A personal portfolio on Next.js 13.3 (Pages Router), built with `output: 'export'` and served as static files from Cloudflare Workers static assets. No Next server, middleware, API route, image optimizer or server action runs in production. A finding that depends on any of those at request time does not apply. Next, React and the animation libraries are pinned on purpose, and the Next upgrade is planned work. A finding that only says "upgrade Next" is noise.

`docs/designs/cloudflare-keystatic.md` is the design. `docs/designs/keystatic-spike.md` holds the measured Keystatic behavior that the content rules below rest on.

## What the tools already cover

Biome (`biome ci .`) runs at the start of `pnpm build`, and the Cloudflare Workers Builds check runs that build on every push. Say nothing about formatting, import order or anything Biome already reports. `pnpm test` (node's test runner, `test/`) covers the content reader and image resolution.

## Content and images

- Content is YAML and JSON under `content/`, read with Keystatic's reader. `keystatic.config.mjs` is the schema. A content file that does not match the schema is a finding.
- An image MUST live inside its own entry's folder under `public/images/`. Keystatic's editor only recognizes an image there, and saving an entry whose image sits elsewhere deletes the reference. A `src` outside the entry's folder is a finding even though the build passes.
- `lib/content.mjs`, `lib/images.mjs` and `lib/markdoc-config.mjs` run in plain Node as well as in Next. They MUST NOT import anything that needs the browser, React or Next-only resolution. `lib/markdoc.js` and the components run in the browser and MUST NOT import `fs` or `lib/images.mjs`.

## Motion is a requirement

The Framer Motion page-exit transitions and the `layoutId` nav highlight are a hard requirement. A change to `pages/_app.js`, the `AnimatePresence`/`LayoutGroup` wiring or the CSS-retention workaround in `_app.js` deserves a close look, because a break there renders a flash of unstyled content and fails no check.

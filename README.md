# Erik's Portfolio Site

The latest iteration of my personal website: a static export of a Next.js site, served from Cloudflare.

## Tech Stack

- [Next.js](https://nextjs.org/) (Pages Router, `output: 'export'`)
- [Framer Motion](https://www.framer.com/motion/)
- [Keystatic](https://keystatic.com/), edited locally
- [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/)

See the full list of dependencies [here](package.json).

## Prerequisites

- [mise](https://mise.jdx.dev), which installs the pinned Node.js and pnpm versions from `mise.toml`

## Installation

```bash
git clone git@github.com:eriksaulnier/erik-website.git
cd erik-website
mise trust && mise install
mise run setup   # installs dependencies and wires up the lefthook git hooks
```

The site needs no environment variables.

## Content

- Content lives in `content/` as YAML and JSON files. `keystatic.config.mjs` is the schema.
- Images live under `public/images/`, in the folder of the entry that uses them. Keystatic only recognizes an image inside its entry's folder, so add images through the editor rather than by hand.
- A page or project with `draft: true` is left out of the build. It is still public in this repository once committed.

## Editing

```bash
# start the site at http://localhost:3000 and the Keystatic editor at http://127.0.0.1:4321/keystatic
mise run dev
```

In dev, every page shows an **Edit in Keystatic** link that opens the matching entry in the editor. Keystatic has no on-page editing, so this link is the shortcut. It is not in production builds.

The editor writes straight to `content/` and `public/images/`. Check the result with `mise run build`, then commit and push. A push to `main` deploys the site.

Upload images as JPEG or WebP at a sensible size. They are served as uploaded.

## Tasks

```bash
mise tasks          # list every task
mise run setup      # install dependencies and wire up lefthook
mise run dev        # Next.js dev server and the Keystatic editor together
mise run dev:site   # Next.js dev server only
mise run build      # biome ci, then static export to out/, plus out/sitemap.xml
mise run preview    # serve out/ through wrangler, as Cloudflare does
mise run admin      # local Keystatic editor
mise run test       # content and image tests
mise run lint       # biome check
mise run format     # biome check --write
```

Each task calls the `package.json` script of the same name, which Cloudflare Workers Builds also uses (`pnpm build`). The build runs `biome ci` first, so a lint error fails the deploy even when a commit skipped the git hooks.

[Biome](https://biomejs.dev) handles lint and formatting. [lefthook](https://lefthook.dev) runs `biome check` on staged files at pre-commit and `node --test` at pre-push.

## Deployment

Cloudflare Workers Builds builds and deploys the `erik-website` Worker on every push to `main`, with build command `pnpm build` and deploy command `npx wrangler deploy`. Other branches get preview URLs. `wrangler.jsonc` holds the asset settings, and `public/_redirects` holds the redirects.

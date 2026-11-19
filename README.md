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
mise install
pnpm install
```

The site needs no environment variables.

## Content

- Content lives in `content/` as YAML and JSON files. `keystatic.config.mjs` is the schema.
- Images live under `public/images/`, in the folder of the entry that uses them. Keystatic only recognizes an image inside its entry's folder, so add images through the editor rather than by hand.
- A page or project with `draft: true` is left out of the build. It is still public in this repository once committed.

## Editing

```bash
# start the local Keystatic editor at http://127.0.0.1:4321/keystatic
pnpm admin
```

The editor writes straight to `content/` and `public/images/`. Check the result with `pnpm build`, then commit and push. A push to `main` deploys the site.

Upload images as JPEG or WebP at a sensible size. They are served as uploaded.

## Run Locally

```bash
pnpm dev       # Next.js dev server
pnpm build     # static export to out/, plus out/sitemap.xml
pnpm preview   # serve out/ through wrangler, as Cloudflare does
pnpm test      # content and image tests
```

## Deployment

Cloudflare Workers Builds builds and deploys the `erik-website` Worker on every push to `main`, with build command `pnpm build` and deploy command `npx wrangler deploy`. Other branches get preview URLs. `wrangler.jsonc` holds the asset settings, and `public/_redirects` holds the redirects.

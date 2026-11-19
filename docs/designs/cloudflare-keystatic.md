# Move erik-website to Cloudflare and replace TinaCMS with Keystatic

*   **Author:** Erik Saulnier
*   **Status:** Proposed
*   **Date:** 2026-11-17

## Overview

erik-website is a personal portfolio built with Next.js 13.3.1 on the Pages Router. It runs on Netlify. Content is edited in TinaCMS and stored as 16 files (15 MDX and one JSON) in a private submodule repo. Images are stored on S3 and served from `uploads.eriksaulnier.com`.

This design moves the site to Cloudflare as a static export and replaces TinaCMS with Keystatic, edited locally. The current design and its Framer Motion page transitions stay as they are. The work ships as one pull request, called slice 1 below:

1. Merge the content into this repo, move the images into the repo, replace Tina with Keystatic's file reader, remove the contact form and the unused posts feature, and serve the static export from Cloudflare Workers static assets.
2. Add a local-only Keystatic admin in `admin/`. The conversion needs it to confirm image paths, and the owner uses it to edit. It writes to the repo's files, and a normal commit and push publishes the change.

A Keystatic spike already ran. Its results are in [keystatic-spike.md](keystatic-spike.md), and this design depends on them. The Next.js upgrade is out of scope. It gets its own design after slice 1 is live.

## The Problem

The site depends on four services: Netlify for hosting, Tina Cloud for editing, S3 for images, and a second GitHub repo for content. Each one has its own account, credentials and failure modes.

*   **Netlify** serves a site that is almost static. Only a few things run code at request time: `fallback: 'blocking'` on the page and post routes, and the sitemap, robots and preview API routes. All of them can be built ahead of time.
*   **Tina** is pinned to 1.5. Its upgrades are tied to Next and React upgrades, and that coupling has kept the site on Next 13 since 2023. It also puts a hosted service in the editing path.
*   **S3** holds 11 images. Build-time resizing can do the same job from files in the repo.
*   **The separate content repo** forces a second commit, or a cross-repo trigger, for every content edit.

The owner already has a paid Cloudflare account. The goal is one platform, content and images as plain files in one repo, and an editor that does not depend on a hosted CMS.

An earlier attempt rewrote the site in Astro with a new design (branch `astro-rewrite`). That rewrite is paused, because the redesign is not wanted now and Astro's full page loads cannot run the current Framer Motion exit transitions.

## Goals

*   **Host on Cloudflare.** The public site is a static export served from Workers static assets.
*   **Content parity.** Every public page shows the same content as the live site, apart from the expected differences listed under Parity check. The page-exit transitions and the `layoutId` nav highlight still play in current Chrome and Firefox.
*   **One repo.** Content and images live in this repo. The `content/` submodule and `.gitmodules` are removed.
*   **Build-time images.** Width, height and the blur placeholder are computed from the files at build time. No image metadata is entered by hand. The build fails, naming the entry and field, on an image reference it cannot resolve.
*   **Local editing.** The owner edits content in a local Keystatic admin, then commits and pushes. A push to `main` redeploys the site with no other step.
*   **No silent breakage.** `/uses` still redirects to `/about/uses`. `sitemap.xml` and `robots.txt` are still served. The contact form and its Netlify markup are gone, not left posting to nowhere.
*   **Safe cutover.** Netlify keeps serving the current site until the Cloudflare build passes its checks on a preview hostname. Every retired service stays untouched until two weeks after cutover, so rollback restores a working site.

## Non-Goals

*   The redesign from the Astro rewrite.
*   The Next.js upgrade. It gets its own design after slice 1 is live.
*   A hosted or browser-reachable admin. There is no admin Worker, GitHub App, OAuth flow or Cloudflare Access app.
*   Moving any public page to the App Router, or replacing Framer Motion with native View Transitions.
*   A contact form, or any replacement for it.
*   Posts. The feature is removed in slice 1 and comes back with the first real post.
*   A server runtime for public pages. No public route runs code at request time.
*   Runtime image resizing, including the Cloudflare Images binding.

## Open Questions

*   **Image paths for a singleton and a Markdoc tag (verify).** The spike confirmed Keystatic's image path for a collection field and for an image inside a block. It did not test the `global` singleton thumbnail or an image inside a Markdoc tag. Implementation confirms both by one upload in the local admin before the conversion runs. See item 4.
*   **Block reorder and indexed image paths (verify).** An image inside a block is stored under the block's index (`blocks/0/...`). The spike did not test whether reordering blocks in the admin moves those files. If it does not, a reorder leaves a broken path, and the build check catches it.

## Critical User Journeys (CUJs)

### CUJ 1: A visitor browses the site (slice 1)

*   **Given**: The site is served from Cloudflare as a static export.
*   **When**: A visitor opens `/`, follows the nav to `/about`, `/projects` and `/about/uses`, and uses the back button.
*   **Then**: Every page loads from static files. The page-exit animation and the sliding nav highlight play in Chrome and Firefox. Images show a blur placeholder first. No request reaches a Worker script.

### CUJ 2: An old link still works (slice 1)

*   **Given**: Search engines and old bookmarks hold `/uses`, `/sitemap.xml` and `/robots.txt`.
*   **When**: Someone requests them.
*   **Then**: `/uses` redirects to `/about/uses` with a 301. `sitemap.xml` lists every published page and the projects index. `robots.txt` is served. An unknown path returns the site's 404 page with a 404 status. Old `/posts` URLs return 404.

### CUJ 3: The owner edits a project locally (slice 1)

*   **Given**: A clone of the repo with dependencies installed.
*   **When**: The owner runs `pnpm admin`, opens `http://127.0.0.1:4321/keystatic`, edits a project description, uploads a new thumbnail and saves.
*   **Then**: The YAML file under `content/projects/` and the image under `public/images/projects/<slug>/` change on disk. `pnpm build` passes. The owner commits and pushes, and Workers Builds redeploys the site.

### CUJ 4: A commit breaks the build (slice 1)

*   **Given**: A commit contains content the build cannot use, for example an image path that does not resolve.
*   **When**: Workers Builds runs.
*   **Then**: The build fails with a message that names the entry and field. The live site keeps serving the last good deploy. The failure shows on the commit's GitHub status and in the Workers Builds log.

## Technical Plan (Architecture)

### Shape of the system

```text
GitHub: eriksaulnier/erik-website (public)
├─ Next.js site (Pages Router)  ── content/**, public/images/**
├─ keystatic.config.mjs          (one schema)
└─ admin/                        (local-only Astro app, Keystatic UI)
        │ push to main
        ▼
Workers Builds: erik-website
  next build (output: 'export') → build-sitemap
        │
        ▼
Workers static assets on eriksaulnier.com (no Worker script runs)
```

### Content model

Content stays as plain files in `content/`, now in this repo. `keystatic.config.mjs` is the only schema. The site reads content through Keystatic's reader (`@keystatic/core/reader`) in `getStaticProps`. The spike confirmed that the reader runs under Next 13.3.1 and React 18 with `output: 'export'`.

*   **`home` (singleton)**: the splash page. Fields: `title`, `heading`, `subheading`, `typed_words` (list), `shuffle_words`. This removes Tina's second page template, because home is the only page that used `splash`.
*   **`pages` (collection, `content/pages/**`)**: Fields: `title`, `heading`, `seo_description`, `draft` and `blocks`. The block types are:
    *   `content`: `title`, `body` (`fields.markdoc.inline`, with an `image` content component), and `aside_image`.
    *   `technology`: `title` and `categories[{label, technologies[{label, icon}]}]`.
    *   The `form`, `projects` and `posts` block types are dropped. No content uses the `projects` or `posts` blocks.
    *   Nested slugs (`about/uses`) are kept through the glob path, so URLs do not change. The spike confirmed this.
*   **`projects` (collection, `content/projects/*`)**: `name`, `draft`, `featured`, `publish_date` (date), `description`, `technologies[{label, icon}]`, `links[{title, href, icon}]` and `thumbnail`. The year folders are dropped from the path, because nothing routes on them and no two projects share a file name.
*   **`global` (singleton, `content/global.json`)**: `title`, `description`, `thumbnail`, `header.navigation[{title, path}]`, `header.social[{title, icon, link}]` and `footer.copyright{year, text}`. JSON keeps the shape that `_app.js` imports directly.

Every image field has the shape `{src: fields.image, alt: fields.text}`. `fields.image` uses `directory: public/images/<area>` and `publicPath: /images/<area>/`, where the area is `pages`, `projects` or `site`.

Pages and projects are YAML data files. A block is stored as `{discriminant, value}`.

**Drafts.** `draft: true` keeps an entry out of the build and the sitemap. Preview mode is removed, because it depended on Tina auth and a static export cannot run it. The three existing drafts (`pages/test.mdx` and both posts) are not imported. A future draft is public in the repo as soon as it is committed. Only the build hides it.

### Conversion

A one-time Node script reads each Tina file, maps it field by field to the Keystatic shape, and writes the new file. It always starts from the content snapshot, so it is safe to run again. It runs once, in the import commit, and is then deleted. Its rules:

*   Drop `_template`. Move `home.mdx` into the `home` singleton and `global/app.config.json` into `content/global.json`.
*   Rewrite each block as `{discriminant: <type>, value: {...}}`. Drop `form` blocks.
*   Convert folded (`>`) YAML strings to literal (`|`) blocks, so that Markdown paragraphs and nested lists keep their line breaks. Keep the Markdown escapes (`mailto\:`, `WD\_BLACK`).
*   Rewrite the one `<image .../>` embed in `about/uses` as an `{% image %}` tag.
*   Normalize `publish_date` to `YYYY-MM-DD`.
*   **Images.** Download each S3 image once. Write it to the path Keystatic's admin would write, then store that public path as `src`. Drop `width`, `height` and `blurhash`, because the build computes them. The spike found that the admin does not show an image at any other path, and that saving such an entry deletes its `src`. The native paths are:
    *   A collection field: `public/images/<area>/<slug>/<field path>/src.<ext>`, for example `/images/projects/pass-the-aux/thumbnail/src.png`.
    *   An image inside a block: `/images/pages/about/blocks/0/value/aside_image/src.png`.
    *   The singleton and Markdoc tag paths are confirmed during implementation. See Open Questions.
*   Check counts at the end: 1 home, 1 global, 3 pages (`about`, `about/uses`, `contact`), 8 projects and 11 images. Exit non-zero on any mismatch, on any field the script cannot map, or on any image download failure.

### Images

The 11 source images live under `public/images/` and are served as they are. New uploads from the local admin land in the same tree. There is no image build step.

`next/image` stays in the components with `images.unoptimized: true`, which a static export allows. `resolveImages` runs in `getStaticProps`:

*   It walks the page data and finds every object whose `src` starts with `/images/`. That rule covers image fields and `{% image %}` tag attributes.
*   For each one, it uses `sharp` to read the file's width and height and to make a 10 px wide blur placeholder as a data URL. It caches results by path for the rest of the build.
*   It returns `{src, width, height, blurDataURL, placeholder: 'blur', alt}`.
*   When the file does not exist, it throws an error that names the entry and field. This one check is the build-time validation for CUJ 4.

`pnpm dev` needs no extra step, because the same code runs on each request in dev. No image is resized at request time on the live site.

The blurhash round trip (`lib/blurhash.js`, `blurhash` and `fast-blurhash`) is removed. The placeholder looks slightly different, but it shows only while the image loads. Images are served at their uploaded size and format, so a new upload SHOULD be a JPEG or WebP of sensible size.

### Rendering rich text

The spike showed that the reader returns a Markdoc body as a `Node` class instance, and that Next rejects class instances in props. So:

*   `lib/content.mjs` runs `Markdoc.transform(node, markdocConfig)` and returns the result as plain JSON. `markdocConfig` lives in `lib/markdoc-config.mjs`, which has no React imports.
*   `lib/markdoc.js` exports `renderMarkdoc(tree)`. It calls `Markdoc.renderers.react` with an `image` component (`next/image`) and a `link` component. The link component uses `next/link` for internal links and opens external links in a new tab, as `content-block.js` does today.
*   `lib/markdoc.js` MUST NOT import `lib/images.mjs` or anything that uses `fs`, because it runs in the browser.

The spike built and rendered this path under Next 13.3.1.

### Module format

The build scripts run in plain Node, and the root `package.json` stays CommonJS. So every file that a script and the site share uses the `.mjs` extension with explicit import extensions: `keystatic.config.mjs`, `lib/content.mjs`, `lib/markdoc-config.mjs` and `lib/images.mjs`. The spike confirmed that Next 13.3 pages can import a `.mjs` config and that plain Node can too.

### Routing and static files

*   `next.config.js` sets `output: 'export'`, `images.unoptimized: true` and `trailingSlash: false`. Every `getStaticPaths` returns `fallback: false`.
*   **Removed routes**: the post routes, `pages/api/*` and the `/admin` rewrite. `robots.txt` becomes a static file in `public/`. `sitemap.xml` is written by a build step through `lib/content.mjs`.
*   **Redirects**: `/uses /about/uses 301` moves from `netlify.toml` to `public/_redirects`.
*   **404 and paths**: `wrangler.jsonc` points assets at `out/`, with `not_found_handling: "404-page"` and `html_handling: "auto-trailing-slash"`. There is no Worker `main` script.
*   **`www`**: a zone Redirect Rule sends `www.eriksaulnier.com` to the apex with a 301. `_redirects` cannot match on host.

### Local editor

The spike ran this setup and confirmed it.

*   `admin/` holds `astro.config.mjs` (the `react()` and `keystatic()` integrations, no adapter), `keystatic.config.mjs` (one line that re-exports `../keystatic.config.mjs`) and `src/pages/index.astro` (a link to `/keystatic`).
*   `astro`, `@astrojs/react` and `@keystatic/astro` are root dev dependencies. No pnpm workspace is needed.
*   `pnpm admin` runs `astro dev --root admin` from the repo root. Keystatic local mode writes relative to the working directory, so saves land in the root `content/` and `public/images/`.
*   Astro 7 needs Node 22.23.4 or later.
*   `@keystatic/next` needs Next 14 or later. After the Next upgrade, the editor could move into the Next app as a dev-only route and `admin/` could go.

### Hosting, deploys and DNS

*   **One Worker**, `erik-website`, built by Workers Builds from this repo. The production branch is `main`. Other branches get preview URLs. A failed build reports a failed GitHub commit status, and the last good deploy stays live.
*   **DNS.** The zone moves from Route 53 to Cloudflare before any code merges, and runs on its own for at least a few days. The steps are under Operations.
*   **Retirement.** Netlify, S3, Tina Cloud and the private content repo all stay untouched until two weeks after cutover. The old Netlify deploy reads Tina and S3 at request time, so retiring either one early breaks rollback.

### Parity check

The parity check is a one-time manual check for slice 1, done once before cutover. Netlify keeps serving the old site until cutover, so the two sites can be compared side by side.

*   Open `/`, `/about`, `/about/uses`, `/contact` and `/projects` on the live site and on the `workers.dev` URL, in Chrome and Firefox. Compare text, links, images and the page-exit transitions and nav highlight.
*   **Expected differences**: the TinaCMS and Netlify credits in the footer, the form on `/contact`, and the words "using the form below or" in the `/contact` text. Any other difference blocks cutover.
*   Run the `curl` checks from the Verification Plan against both hosts.

## Alternatives Considered

### Alternative A: Finish the Astro rewrite

*   **Pros**: Already has Keystatic, a Cloudflare adapter spike, ADRs and a finished design pass.
*   **Cons**: It is tied to a new design. Astro does a full page load on every navigation, so `AnimatePresence` exit animations cannot run across pages.
*   **Reason for Rejection**: The redesign is not wanted now, and the Framer Motion page transitions are a hard requirement.

### Alternative B: Move public pages to the Next.js App Router

*   **Pros**: Next's current default.
*   **Cons**: [vercel/next.js#49279](https://github.com/vercel/next.js/issues/49279), open since 2023-05, breaks `AnimatePresence` exit animations and `LayoutGroup` animations under the App Router.
*   **Reason for Rejection**: The transitions are a hard requirement.

### Alternative C: Native View Transitions in place of Framer Motion

*   **Pros**: No animation library.
*   **Cons**: Weaker support in Firefox. Commenters on [#49279](https://github.com/vercel/next.js/issues/49279) report that view transitions cannot be interrupted.
*   **Reason for Rejection**: Poor Firefox support, and the current transitions are wanted as they are.

### Alternative D: Run the full Next app on a Worker with OpenNext

*   **Pros**: Request-time rendering stays available.
*   **Cons**: OpenNext supports only Next 15 and 16, so the upgrade would have to land before the host move. It puts a Next server on Workers for pages that need no server. `next/image` would need the billed Cloudflare Images binding.
*   **Reason for Rejection**: A static export needs no server, and it keeps the Next upgrade separate.

### Alternative E: A hosted Keystatic admin

*   **Pros**: Browser editing from any device, with no clone needed.
*   **Cons**: It adds an admin Worker, a hand-made GitHub App, three secrets, an Access application and an OAuth flow that has never run on workerd.
*   **Reason for Rejection**: Content was last edited in 2023. Local editing covers that rate of change with none of the hosted parts.

### Alternative F: Edit YAML by hand or in github.dev, with no admin

*   **Pros**: No `admin/` folder and no Astro dependency.
*   **Cons**: No schema validation while editing. Image uploads have to follow Keystatic's path layout by hand.
*   **Reason for Rejection**: The local admin costs one small folder and three dev dependencies, and it keeps images at the paths that the schema expects. It also stays available as a fallback at any time.

### Alternative G: Merge the content repo's full history

*   **Pros**: `git log` and `git blame` on content reach back to 2021.
*   **Cons**: Every earlier revision of the writing becomes public permanently.
*   **Reason for Rejection**: The content repo was private because of discomfort with the old writing. A snapshot import, with the private repo archived, keeps the history without publishing it.

### Alternative H: Keep content in the separate repo

*   **Pros**: The content stays private.
*   **Cons**: Keystatic commits to one repo. Every edit would need a second commit to move the submodule pointer.
*   **Reason for Rejection**: The cost of two commits per edit outweighs the privacy of current content, which is public on the site anyway.

### Alternative I: Keep images on S3

*   **Pros**: Images stay out of git.
*   **Cons**: Keystatic cannot upload to S3, so images would become plain URL fields. The AWS account and credentials would stay.
*   **Reason for Rejection**: There are 11 images, and the repo can hold them.

### Alternative J: A custom `next/image` loader with several widths

*   **Pros**: Responsive `srcset` sizes, like Next's optimizer.
*   **Cons**: The loader runs in the browser and cannot know which widths were built, so it can request missing files. No component passes `sizes`, so most widths would go unused. The images with recorded sizes are 1000 px wide or smaller.
*   **Reason for Rejection**: Serving each image at its uploaded size is enough at this scale, and `unoptimized` needs no loader.

### Alternative K: MDX for rich text

*   **Pros**: Any React component can be embedded inline.
*   **Cons**: Stray `{`, `<` or `>` in prose fail the build. Keystatic's MDX editing is less complete than its Markdoc editing.
*   **Reason for Rejection**: The content has one embedded component, and a declared Markdoc tag covers it.

### Alternative L: Replace the contact form

*   **Pros**: Visitors keep a form to reach the owner.
*   **Cons**: Needs a Worker route with Turnstile and an email service. It is a new runtime path on a static site.
*   **Reason for Rejection**: The form mainly drew spam.

## Risks and Mitigations

*   **Rollback restores a broken site.** The old deploy reads Tina Cloud and S3 at request time. *Mitigation*: nothing is retired until two weeks after cutover.
*   **The nameserver move breaks mail or the old site.** *Mitigation*: the DNS checklist under Operations. Lower TTLs first, check DNSSEC, copy records as DNS-only, and compare `dig` answers before the switch.
*   **An image lands at a path that the admin does not recognize.** Saving that entry then deletes its `src`. *Mitigation*: the conversion writes native paths, and the build fails on any `src` that is not in the manifest.
*   **Drafts are public.** A draft is in the public repo once it is committed. *Mitigation*: none in the code. Keep unpublished writing out of commits.
*   **An oversized upload.** Workers static assets refuse a file over 25 MiB. *Mitigation*: `resolveImages` fails the build on any image over 10 MiB.

## Non-Functional Requirements

*   **Security & Privacy**: The site build needs no secrets. At retirement, the AWS IAM key pair behind `NEXT_PUBLIC_S3_ACCESS_KEY` and `S3_SECRET_KEY`, and the Tina Cloud client and token, are revoked, not just left unused. A secret scan (`gitleaks`, installed through mise) runs over the content snapshot before the import commit.
*   **Performance**: The public site serves static files with no Worker script. Images are served at their uploaded size with blur placeholders. Today's AVIF and WebP conversion is dropped.
*   **Rollout & Rollback**: See Operations and the retirement rule above.

## Additional Resources

*   [keystatic-spike.md](keystatic-spike.md): the spike results this design depends on.
*   Branch `astro-rewrite`, especially `docs/adr/0002-cms-keystatic.md` and `docs/adr/0010-image-handling.md`.
*   [vercel/next.js#49279](https://github.com/vercel/next.js/issues/49279) and [OpenNext Cloudflare](https://opennext.js.org/cloudflare).

## Future Improvements

*   **Next.js upgrade.** Next 13.3 to 16 and React 19, with automated transition checks and the CSS-retention workaround in `_app.js`. It gets its own design after slice 1 is live.
*   **Posts.** Re-add a `posts` collection and routes with the first real post.
*   **Travel map.** A `places` collection plus a `map` block type. The old `origin/feature/map-block` branch is prior work.

## Detailed Implementation Plan

Each slice is one pull request. "Verify" marks a behavior to confirm, with its pass condition and its fallback.

### Slice 1: Static export on Cloudflare, content and images in the repo, Tina removed

#### Content and schema

##### 1. `keystatic.config.mjs` (Create)

*   **Proposed Changes**: The schema from the Content model section. Storage is `{kind: 'local'}`. The `content` block body is `fields.markdoc.inline` with an `image` content component (`src` as `fields.image`, `alt` required).

##### 2. `content/**` (Create)

*   **Proposed Changes**: The conversion writes `content/home.yaml`, `content/global.json`, `content/pages/about.yaml`, `content/pages/about/uses.yaml`, `content/pages/contact.yaml` and 8 files at `content/projects/<slug>.yaml`. `contact.yaml` keeps its content block, with "using the form below or" removed from its text. The import commit message names the source repo and its commit SHA (`810083c`).

##### 3. `content` submodule gitlink and `.gitmodules` (Delete)

*   **Proposed Changes**: Remove the submodule in the same commit that adds `content/**`.

##### 4. `scripts/convert-tina.mjs` (Create, then Delete in the same PR)

*   **Proposed Changes**: Takes the snapshot path as its first argument, for example `node scripts/convert-tina.mjs ../erik-website-content`. Applies the Conversion rules. Downloads the 11 images to their native paths.
*   **Before the first run (verify)**: Build the local editor (items 30 and 31) first. In the local admin, upload one image to the `global` thumbnail and one through an `{% image %}` tag. Record the paths that Keystatic writes and use them in the script. Pass: the admin shows both converted images after the conversion. Fallback: move the desk photo into the block's `aside_image`, and accept the layout change on `/about/uses` as an expected difference.

##### 5. `public/images/**` (Create)

*   **Proposed Changes**: The 11 images, written by item 4 at native paths.

#### Reading and rendering

##### 6. `lib/content.mjs` (Create)

*   **Type / Scope**: Content access, used by `getStaticProps`, `getStaticPaths` and `build-sitemap.mjs`. It does no image work.
*   **Proposed Changes**:
    *   Creates one reader with `createReader(process.cwd(), config)`.
    *   Exports `getHome()`, `getGlobal()`, `getPage(slug)`, `listPageSlugs()` and `listProjects({featuredOnly})`.
    *   `getPage` returns `null` for a draft. `listPageSlugs` and `listProjects` drop drafts. `listProjects` sorts by `publish_date`, newest first.
    *   Each Markdoc body is transformed and returned as plain JSON (see Rendering rich text).
    *   `listPageSlugs` returns slug strings such as `about/uses`. Callers split them for `params.slug`.

##### 7. `lib/images.mjs` (Create) and `lib/images.js`, `lib/blurhash.js` (Delete)

*   **Proposed Changes**: Exports `async resolveImages(data, label)`, as described under Images. On a missing file, it throws `Image not found: <src> in <label> at <field path>`. It also throws on a file over 10 MiB, because Workers static assets refuse a file over 25 MiB.

##### 8. `lib/markdoc-config.mjs` and `lib/markdoc.js` (Create)

*   **Proposed Changes**: As described under Rendering rich text. The `image` component reads the attributes that `resolveImages` filled in.

##### 9. `pages/index.js` (Modify)

*   **Proposed Changes**: `getStaticProps` returns `getHome()`. Remove `useTina` and the Tina client import.

##### 10. `pages/[...slug].js` (Modify)

*   **Proposed Changes**:
    *   `getStaticPaths` maps `listPageSlugs()` to `{params: {slug: s.split('/')}}` with `fallback: false`.
    *   `getStaticProps` returns `{page: resolveImages(page, slug), slug}`. The component uses `slug` for its `key`, where it used `variables.relativePath` before.
    *   Blocks are chosen by `block.discriminant`. Each component receives `data={block.value}`, because the components read their fields directly.
    *   Remove `useTina`, preview handling, `_sys.breadcrumbs`, `transformImages` and the `PostsBlock` and `FormBlock` imports.
    *   Keep the `motion.div` wrappers unchanged.

##### 11. `pages/projects/index.js` (Modify)

*   **Proposed Changes**: `getStaticProps` returns `resolveImages(await listProjects({featuredOnly: true}), 'projects')`, as the current page filters on `featured`. The page shows 7 of the 8 projects. Pass the list as `<ProjectsBlock data={{projects}} />`. Remove `useTina`, `transformImages` and the connection `edges` handling.

##### 12. `pages/posts/**` and `components/blocks/posts-block/**` (Delete)

*   **Proposed Changes**: Posts are removed.

##### 13. `pages/_app.js` (Modify)

*   **Proposed Changes**: Import `content/global.json` in place of `content/global/app.config.json`. Stop passing `pageProps.preview`. Delete the "fetched using Tina" TODO. Leave `AnimatePresence`, `LayoutGroup` and the CSS-retention workaround untouched.

##### 14. `components/layout/layout.js` (Modify)

*   **Proposed Changes**: Drop the `preview` prop. Set `og:image` to `https://eriksaulnier.com` + `appConfig.thumbnail.src`, because the thumbnail is now an object with a relative path.

##### 15. `components/blocks/index.js` (Modify)

*   **Proposed Changes**: Keep the named exports `ContentBlock`, `TechnologyBlock` and `ProjectsBlock`. Remove `FormBlock` and `PostsBlock`. Add `blockComponents`, a map from discriminant (`content`, `technology`) to component.

##### 16. `components/blocks/content-block/content-block.js` (Modify)

*   **Proposed Changes**: Render `body` with `renderMarkdoc`. Render `aside_image` from the resolved shape. Remove the `TinaMarkdown` import.

##### 17. `components/blocks/projects-block/project-list/project/project.js` (Modify)

*   **Proposed Changes**: Read the project directly, without the `data.node || data` fallback. Keep the `alt` fallback to `project.name`.

##### 18. `components/blocks/form-block/**` (Delete)

*   **Proposed Changes**: Delete the form block, its five field components and its styles.

##### 19. `components/layout/footer/footer.js` (Modify)

*   **Proposed Changes**: Remove the TinaCMS and Netlify credits.

#### Build, hosting and config

##### 20. `scripts/build-sitemap.mjs` (Create)

*   **Proposed Changes**: Writes `out/sitemap.xml` with `/`, `/projects` and every slug from `listPageSlugs()`, under `https://eriksaulnier.com`. Imports only `lib/content.mjs`. It also checks that the `global` thumbnail file exists under `public/`, and fails the build if it does not, because `_app.js` imports that path directly and `resolveImages` never sees it.

##### 21. `public/robots.txt` (Create) and `pages/api/**` (Delete)

*   **Proposed Changes**: A static `robots.txt` that allows all paths and points at the sitemap. Delete `robots.txt.js`, `sitemap.xml.js`, `preview/enter.js`, `preview/exit.js` and `s3/[...media].js`.

##### 22. `public/_redirects` (Create) and `netlify.toml` (Delete)

*   **Proposed Changes**: Add `/uses /about/uses 301`.

##### 23. `next.config.js` (Modify)

*   **Proposed Changes**: Set `output: 'export'`, `trailingSlash: false` and `images: {unoptimized: true}`. Remove `formats`, `remotePatterns`, the three rewrites and the `tina` lint directory. Keep `sassOptions`, `swcMinify`, the webpack `fs` fallback and the bundle analyzer.

##### 24. `wrangler.jsonc` (Create)

*   **Proposed Changes**: `name: erik-website`, `compatibility_date` set to the day the file is created, and `assets: {directory: './out', not_found_handling: '404-page', html_handling: 'auto-trailing-slash'}`. No `main`.

##### 25. `package.json` and `pnpm-lock.yaml` (Modify)

*   **Proposed Changes**:
    *   Scripts:
        *   `dev` = `next dev`.
        *   `build` = `next build && node scripts/build-sitemap.mjs`.
        *   `preview` = `wrangler dev`.
        *   `analyze` = `ANALYZE=true pnpm build`.
        *   Delete `start`, because `next start` does not work with `output: 'export'`.
    *   Add `@keystatic/core` 0.6.10 and `@markdoc/markdoc` 0.5.x.
    *   Add the dev dependency `wrangler`.
    *   Remove `tinacms`, `@tinacms/auth`, `@tinacms/cli`, `next-tinacms-s3`, `lodash`, `blurhash`, `fast-blurhash`, `styled-components`, `plaiceholder`, `react-markdown`, `rehype-raw` and `rehype-sanitize`.
    *   Bump `sharp` to 0.34. Add `"pnpm": {"onlyBuiltDependencies": ["sharp"]}`, because pnpm 10 blocks its install script.

##### 26. `mise.toml` (Create) and `.nvmrc` (Modify)

*   **Proposed Changes**: Pin Node 22.23.5 and pnpm 10.33.2. The spike built Next 13.3.1 on Node 22.23.5. Astro 7 needs 22.23.4 or later. `.nvmrc` matches, because Workers Builds reads it.

##### 27. `.gitignore`, `.env.example`, `jsconfig.json`, `.eslintrc.js` (Modify)

*   **Proposed Changes**: Ignore `/.wrangler/`. Remove the Netlify entries. Delete `.env.example`, because every variable in it is Tina or S3. Remove the `@/tina/*` alias and the `tina/__generated__` ignore.

##### 28. `tina/**`, root `app.config.json`, `public/.gitignore`, `public/admin/.gitignore` (Delete)

*   **Proposed Changes**: Delete the Tina schema, the stale root config and the Tina admin placeholders.

##### 29. `README.md` (Modify)

*   **Proposed Changes**: How to develop, build, preview and edit, and where content and images live. Remove the Tina and Netlify instructions.

#### Operations (no files)

**Before the slice 1 merge:**

1.  Lower the TTL on every Route 53 record to 300 seconds. Wait out the old TTL.
2.  Add the `eriksaulnier.com` zone to Cloudflare. Copy every Route 53 record by hand as DNS-only, including ALIAS records as their target values, MX, SPF, DKIM and verification TXT records.
3.  If DNSSEC is on in Route 53, turn it off and remove the DS record at the registrar. Wait for the DS TTL.
4.  Compare `dig` answers from Cloudflare's nameservers with Route 53's for every record. Then switch the nameservers at the registrar.
5.  Check mail delivery and the old site. Wait a few days. *Rollback for this step*: switch the nameservers back to Route 53.
6.  Turn off Netlify auto-publishing. Tag the last published commit `netlify-final`. Note the Netlify certificate expiry date.

**After the merge:**

7.  Create the `erik-website` Worker in Workers Builds from this repo. Build command `pnpm build`, deploy command `npx wrangler deploy`, production branch `main`, preview URLs on.
8.  Do the parity check from the Parity check section.
9.  **Cutover**: attach `eriksaulnier.com` to the Worker as a custom domain. Replace the `www` record with a proxied `AAAA 100::` record, because a Redirect Rule runs only on proxied traffic. Add the `www` Redirect Rule. Check that `https://www.eriksaulnier.com/about` returns a 301 to the apex.
10. **Rollback**, if needed: detach the custom domain, turn off the `www` Redirect Rule, and recreate the apex and `www` records as DNS-only, pointing at Netlify.
11. Two weeks after cutover with no rollback: archive `eriksaulnier/erik-website-content` (it stays private), and delete the Netlify site, the S3 bucket and its IAM key pair, the Tina Cloud project and the Route 53 hosted zone. Revoke the credentials.

#### Local editor

##### 30. `admin/astro.config.mjs`, `admin/keystatic.config.mjs`, `admin/src/pages/index.astro` (Create)

*   **Proposed Changes**: As described under Local editor.

##### 31. `package.json` (Modify)

*   **Proposed Changes**: Add dev dependencies `astro` 7, `@astrojs/react` and `@keystatic/astro` 6. Add the script `admin` = `astro dev --root admin`.

##### 32. `.gitignore` and `README.md` (Modify)

*   **Proposed Changes**: Ignore `admin/.astro/`. Document `pnpm admin`, and the steps from edit to commit to push.

### Verification Plan

*   **Build**: `pnpm build` exits 0. `out/` contains HTML for `/`, `/about`, `/about/uses`, `/contact`, `/projects` and `404`, plus `sitemap.xml`, `robots.txt` and `_redirects`. `command grep -rlE "tinacms|tina\.io|TinaMarkdown" out/` finds nothing. (`command` bypasses the gitignore-aware `grep` alias.)
*   **Local serve**: `pnpm preview` serves `out/`. `curl` checks:
    *   `/`, `/about`, `/about/uses`, `/contact` and `/projects` return 200.
    *   `/uses` returns a 301 to `/about/uses`.
    *   `/posts` and an unknown path return 404 with the site's 404 page.
*   **Parity**: the side-by-side check finds only the expected differences.
*   **Lint**: `pnpm lint` passes.
*   **Images**: each of the 11 images appears on its page with a blur placeholder. A broken `src` fails `pnpm build` with the entry and field.
*   **Fresh clone**: `pnpm install && pnpm dev` serves `/about` with its image.
*   **Hosting**: the `curl` checks pass against the `workers.dev` URL, and against `eriksaulnier.com` after cutover. `www` redirects to the apex. Mail still arrives after the nameserver move.
*   **Local editor**: CUJ 3 runs end to end. The admin shows all 8 project thumbnails and the about image. A save changes only files under the root `content/` and `public/images/`.

*Drafted with EGM*

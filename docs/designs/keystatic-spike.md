# Keystatic spike results (Slice 0)

Run date: 2026-11-17. Code was throwaway, in a scratch folder.

Versions: `@keystatic/core` 0.6.10, `@keystatic/astro` 6.0.0, Astro 7.4.12, `@astrojs/react` 7.1.9, Next 13.3.1, React 18.2.0, `@markdoc/markdoc` 0.5.13, pnpm 10.33.2.

Schema tested: a `pages` collection with path `content/pages/**`, YAML data, and `blocks` holding a `content` block (`title`, `markdoc.inline` body, `{src: fields.image, alt}`). A `projects` collection with path `content/projects/*` and a `thumbnail` with the same image shape. A `global` singleton in JSON.

## Results

1. **The local editor works from an `admin/` folder if it starts at the repo root.**
   - Command: `astro dev --root admin` from the repo root. `admin/keystatic.config.mjs` re-exports `../keystatic.config.mjs`.
   - Keystatic local mode writes relative to the working directory, so saves land in the root `content/` and `public/images/`.
   - Astro 7 needs Node 22.23.4 or later. Node 22.22.2 is refused.
   - In an agent shell, Astro 7 moves `dev` to a detached process by default. `--ignore-lock` keeps it in the foreground. This does not affect a person running it in a terminal.

2. **An image must sit inside its own entry's folder, or the admin deletes the reference.**
   - The admin writes `<directory>/<entry slug>/<field path>/src.<ext>` and stores that public path in the YAML. A singleton has no slug: `<directory>/<field path>/src.<ext>`.
   - Project thumbnail: `/images/projects/pass-the-aux/thumbnail/src.png`.
   - Image inside a block: `/images/pages/about/blocks/0/value/aside_image/src.png`. The path includes the block index.
   - `global` singleton thumbnail: `/images/site/thumbnail/src.png`.
   - A hand-converted entry with `src: /images/projects/storywings.png`, outside the entry's folder, showed no image in the admin. **Saving the entry removed `src` from the YAML.**
   - Any file name inside the entry's folder is recognized. `/images/projects/storywings/storywings.png` displayed (800 px). For a field image, the next save moves the file to the `<field path>/src.<ext>` name and rewrites `src` to match. The `about` aside image at `/images/pages/about/erik-saulnier.png` became `/images/pages/about/blocks/0/value/aside_image/src.png` on save.
   - An image inside an `{% image %}` Markdoc tag keeps its file name. A test file at `/images/pages/about/uses/desk.png` displayed in the tag's editor, and a save of `about/uses` left both the file and the `src` unchanged.
   - A nested entry's folder survives a save of its parent. Saving `about` with `about/uses` present left `content/pages/about/uses.yaml` and the same test file in place. The converted content uses `desk-2023.png` at that folder, under the same rule.
   - The conversion MUST write each image inside its entry's folder.
   - Not tested: whether reordering blocks moves the indexed image files.

3. **The block YAML shape is `{discriminant, value}`.** Hand-written blocks in that shape load in the admin.

4. **The glob path keeps nested slugs.** `content/pages/about/uses.yaml` lists as `about/uses`.

5. **`markdoc.inline` works inside a blocks array.** The admin shows paragraphs and links from a YAML `|` string. The reader returns `{ node }`, which is a Markdoc `Node` class instance.

6. **The reader runs under Next 13.3.1 and React 18 with `output: 'export'`.** It also runs in plain Node 20 and 24.
   - Returning the reader's body from `getStaticProps` fails Next's serialization check. This confirms Stage 9 B2.
   - `Markdoc.transform(body.node)`, then `JSON.parse(JSON.stringify(tree))` in `getStaticProps`, then `Markdoc.renderers.react(tree, React)` in the component builds and renders correctly. The `/about` HTML contained the text and the `https://rpi.edu` link.
   - `next build` passed on Node 20.20.2 and Node 22.23.5.
   - A `.js` page that imports `keystatic.config.mjs` builds. A plain-Node `.mjs` script that imports the same config also works.

7. **pnpm 10 blocks install scripts.** It ignored `sharp` and `esbuild` build scripts. The plan needs `pnpm.onlyBuiltDependencies` for `sharp`.

8. **`@keystatic/next` 5 needs Next 14 or later.** The editor cannot live in the Next 13 app. After the Next upgrade, it could move into the Next app as a dev-only route, which would remove the Astro folder.

## Content facts (from `content/` at `810083c`)

- 16 files: 15 MDX and `global/app.config.json`.
- 5 pages: `home`, `about`, `about/uses`, `contact`, `test`. 2 posts. 8 projects. No project slug collisions.
- 3 drafts: `pages/test.mdx` and both posts. No published posts exist.
- 11 remote images. Tina image objects already carry `width`, `height` and `blurhash`.
- No page uses a projects or posts reference block. There are no references to convert.
- `/contact` keeps a content block after the form block is removed, and the nav links to it.

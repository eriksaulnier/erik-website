import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

// Local-only editor. Run from the repo root (`pnpm admin`) so Keystatic's
// local mode writes to the root content/ and public/images/.
export default defineConfig({
  integrations: [react(), keystatic()],
});

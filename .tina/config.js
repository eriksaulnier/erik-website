import { defineConfig, defineSchema } from 'tinacms';
import collections from './collections';

const schema = defineSchema({
  collections
});

export const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD,
  token: process.env.TINA_TOKEN,
  localContentPath: '../content',
  media: {
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-s3')
      return pack.TinaCloudS3MediaStore
    },
  },
  admin: {
    auth: {
      onLogin: async ({ token }) => {
        //  When the user logs in enter preview mode
        location.href = `/api/preview/enter?token=${token.id_token}&slug=${location}`
      },
      onLogout: async () => {
        // When the user logs out exit preview mode
        location.href = `/api/preview/exit?slug=${location}`
      },
    },
  },
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  schema,
});

export default config;

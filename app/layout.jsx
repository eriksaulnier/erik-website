'use client';

import { LayoutGroup, AnimatePresence } from 'framer-motion';
// import { Layout } from '@/÷components/layout';
import '@/styles/globals.scss';

import appConfig from '../content/global/app.config.json';

export const metadata = {
  title: 'Title Here',
  description: 'SEO Description goes here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutGroup>
          {/* <Layout appConfig={appConfig} pageTitle={pageProps?.tab_title || null} preview={pageProps.preview}> */}
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
          {/* </Layout> */}
        </LayoutGroup>
      </body>
    </html>
  );
}
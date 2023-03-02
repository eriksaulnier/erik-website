import { useEffect } from 'react'
import { AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/layout'
import appConfig from '@/appConfig'
import '@/styles/globals.scss'

export default function MyApp({ Component, pageProps, router }) {
  // Temporary fix to avoid flash of unstyled content
  // during route transitions. Keep an eye on this
  // issue and remove this code when resolved:
  // https://github.com/vercel/next.js/issues/17464
  useEffect(() => {
    Array.from(
      document.querySelectorAll('head > link[rel="stylesheet"][data-n-p]')
    ).forEach(node => {
      node.removeAttribute('data-n-p');
    });
    const mutationHandler = mutations => {
      mutations.forEach(({ target }) => {
        if (target.nodeName === 'STYLE') {
          if (target.getAttribute('media') === 'x') {
            target.removeAttribute('media');
          }
        }
      });
    };
    
    const observer = new MutationObserver(mutationHandler);
    observer.observe(document.head, {
      subtree: true,
      attributeFilter: ['media'],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AnimateSharedLayout>
      <Layout appConfig={appConfig} pageTitle={pageProps?.tab_title || null}>
        <AnimatePresence exitBeforeEnter>
          <Component layout {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </Layout>
    </AnimateSharedLayout>
  )
}

import { useEffect } from 'react';
import { LayoutGroup, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import dynamic from 'next/dynamic';
import '@/styles/globals.scss';

// The condition is a build-time constant, so production bundles drop the import entirely.
const EditLink =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@/components/edit-link'))
    : () => null;

// TODO: Temporary fix to avoid flash of unstyled content during route
// transitions. Keep an eye on this issue and remove this code when resolved:
// https://github.com/vercel/next.js/issues/17464
export const useNextCssRemovalPrevention = () => {
  useEffect(() => {
    // Next.js removes server-rendered stylesheets whose link node carries data-n-p.
    document.querySelectorAll('head > link[data-n-p]').forEach((linkNode) => {
      linkNode.removeAttribute('data-n-p');
    });

    const mutationHandler = (mutations) => {
      mutations.forEach(({ target, addedNodes }) => {
        if (target.nodeName === 'HEAD') {
          // Next.js removes or disables dynamic stylesheets that keep data-n-href or media.
          addedNodes.forEach((node) => {
            const el = node;
            if (el.nodeName === 'STYLE' && el.hasAttribute('data-n-href')) {
              const href = el.getAttribute('data-n-href');
              if (href) {
                el.setAttribute('data-n-href-perm', href);
                el.removeAttribute('data-n-href');
                el.removeAttribute('media');
              }
            }
          });

          // Remove all stylesheets that we don't need anymore
          // (all except the two that were most recently added).
          const styleNodes = document.querySelectorAll(
            'head > style[data-n-href-perm]',
          );
          const requiredHrefs = new Set();
          for (let i = styleNodes.length - 1; i >= 0; i--) {
            const el = styleNodes[i];
            if (requiredHrefs.size < 2) {
              const href = el.getAttribute('data-n-href-perm');
              if (href) {
                if (requiredHrefs.has(href)) {
                  el.parentNode.removeChild(el);
                } else {
                  requiredHrefs.add(href);
                }
              }
            } else {
              el.parentNode.removeChild(el);
            }
          }
        }
      });
    };

    const observer = new MutationObserver(mutationHandler);
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default function MyApp({ Component, pageProps, router }) {
  useNextCssRemovalPrevention();
  // The client-side error fallback renders without getStaticProps, so it has no site config.
  // scripts/build-sitemap.mjs fails the build if an exported page lost its layout this way.
  if (!pageProps.site) return <Component {...pageProps} />;
  return (
    <LayoutGroup>
      <Layout
        appConfig={pageProps.site}
        pageTitle={pageProps?.tab_title || null}
      >
        <AnimatePresence mode="wait">
          <Component layout {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </Layout>
      <EditLink />
    </LayoutGroup>
  );
}

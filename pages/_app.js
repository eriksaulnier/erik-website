import { AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import { getSiteConfig } from '../lib/api'
import { Layout } from '../components/layout'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps, router }) {
  const siteConfig = getSiteConfig();

  return (
    <AnimateSharedLayout>
      <Layout siteConfig={siteConfig} pageTitle={pageProps?.tab_title || null}>
        <AnimatePresence exitBeforeEnter>
          <Component layout {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </Layout>
    </AnimateSharedLayout>
  )
}

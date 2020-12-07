import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { Layout } from '../components/layout'
import { getSiteSettings } from '../lib/api'
import '../styles/globals.scss'

export default function MyApp({ Component, siteProps, pageProps }) {
  return (
    <AnimateSharedLayout>
      <Layout site={siteProps} pageTitle={pageProps?.tab_title || null}>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} />
        </AnimatePresence>
      </Layout>
    </AnimateSharedLayout>
  )
}

MyApp.getInitialProps = async () => {
  const siteProps = getSiteSettings()

  return { siteProps }
}

import { useRouter } from 'next/router'
import { AnimateSharedLayout } from 'framer-motion'
import { getSiteConfig } from '../lib/api'
import { Layout } from '../components/layout'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const siteConfig = getSiteConfig();
  
  return (
    <AnimateSharedLayout type="crossfade">
      <Layout siteConfig={siteConfig} pageTitle={pageProps?.tab_title || null}>
          <Component {...pageProps} key={router.route} />
      </Layout>
    </AnimateSharedLayout>
  )
}

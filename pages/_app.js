import { useRouter } from 'next/router'
import { getSiteConfig } from '../lib/api'
import { Layout } from '../components/layout'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const siteConfig = getSiteConfig();
  
  return (
    <AnimateSharedLayout>
      <Layout layout siteConfig={siteConfig} pageTitle={pageProps?.tab_title || null}>
        <AnimatePresence>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </AnimateSharedLayout>
  )
}

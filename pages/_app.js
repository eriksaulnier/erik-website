import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { Layout } from '../components/layout'
import siteConfig from '../app.config'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  // Transform siteConfig data
  siteConfig.header.navigation = siteConfig.header.navigation.map(item => {
    item.slug = item.page.match(/(?<=content\/pages\/)(.*)(?=\.md)+/g)[0] || null
    return item
  })
  
  return (
    <AnimateSharedLayout>
      <Layout siteConfig={siteConfig} pageTitle={pageProps?.tab_title || null}>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} />
        </AnimatePresence>
      </Layout>
    </AnimateSharedLayout>
  )
}

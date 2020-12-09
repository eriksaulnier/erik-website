import { useRouter } from 'next/router'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { Layout } from '../components/layout'
import siteConfig from '../app.config'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Transform siteConfig data
  siteConfig.header.navigation = siteConfig.header.navigation.map(item => {
    item.slug = item.page.match(/(?<=content\/pages\/)(.*)(?=\.md)+/g)[0] || null
    return item
  })

  console.log(router.route)
  
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

import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <AnimateSharedLayout>
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} />
      </AnimatePresence>
    </AnimateSharedLayout>
  )
}
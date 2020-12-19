import { useState } from 'react'
import { Router } from 'next/router'
import { AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import { getSiteConfig } from '../lib/api'
import { Layout } from '../components/layout'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps, router }) {
  const siteConfig = getSiteConfig();

  useState(() => {
    const routeChange = () => {
      // Temporary fix to avoid flash of unstyled content
      // during route transitions. Keep an eye on this
      // issue and remove this code when resolved:
      // https://github.com/vercel/next.js/issues/17464

      const tempFix = () => {
        const allStyleElems = document.querySelectorAll('style[media="x"]')
        allStyleElems.forEach((elem) => {
          elem.removeAttribute('media')
        })
      }
      tempFix()
    }

    Router.events.on('routeChangeComplete', routeChange)
    Router.events.on('routeChangeStart', routeChange)
  }, [])

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

import Head from 'next/head'
import { motion, AnimateSharedLayout } from 'framer-motion'
import Header from './header'
import Footer from './footer'
import styles from './layout.module.scss'

export default function Layout({ siteConfig, pageTitle, children }) {
  return (
    <div className={styles.Layout}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteConfig?.site_title
          )}.png?theme=dark&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteConfig?.site_title} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageTitle ? `${pageTitle} | ${siteConfig?.site_title}` : siteConfig?.site_title}</title>
      </Head>

      <AnimateSharedLayout>
        <Header layoutId="header" siteTitle={siteConfig?.site_title} {...siteConfig?.header} />
        <main className={styles.Content}>
            <div className={styles.Container}>
              {children}
            </div>
        </main>
        <Footer layoutId="footer" {...siteConfig?.footer} />
      </AnimateSharedLayout>
    </div>
  )
}
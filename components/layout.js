import Head from 'next/head'
import Header from './header'
import Footer from './footer'
import styles from './layout.module.scss'

export const siteTitle = 'Erik Saulnier'

export default function Layout({ children, pageTitle }) {
  return (
    <div className={styles.layout}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=dark&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle}</title>
      </Head>

      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
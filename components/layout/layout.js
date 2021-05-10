import Head from 'next/head'
import Header from './header'
import Footer from './footer'
import styles from './layout.module.scss'

export default function Layout({ siteConfig, pageTitle, children }) {
  return (
    <div className={styles.layout}>
      <Head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="msapplication-TileColor" content="#181a1b"/>
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#181a1b"/>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteConfig.site_title
          )}.png?theme=dark&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteConfig.site_title} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageTitle ? `${pageTitle} | ${siteConfig.site_title}` : siteConfig.site_title}</title>
      </Head>

      <Header siteTitle={siteConfig.site_title} {...siteConfig.header} />
      <main className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <Footer layout siteTitle={siteConfig.site_title} {...siteConfig.footer} />
    </div>
  )
}
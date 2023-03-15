import Head from 'next/head';
import Header from './header';
import Footer from './footer';
import styles from './layout.module.scss';

export default function Layout({ appConfig, pageTitle, preview, children }) {
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
        <meta name="msapplication-TileColor" content="#FFFFFF"/>
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#FFFFFF"/>
        {appConfig.description && <meta
          name="description"
          content={appConfig.description}
        />}
        {appConfig.thumbnail && <meta
          property="og:image"
          content={appConfig.thumbnail}
        />}
        <meta name="og:title" content={appConfig.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{pageTitle ? `${pageTitle} | ${appConfig.title}` : appConfig.title}</title>
      </Head>

      <Header siteTitle={appConfig.title} {...appConfig.header} />
      <main className={styles.content}>
        <div className={styles.container}>
          {preview && (
            <div>
              You are in preview-mode
              <a
                href={'/admin/index.html#/logout?slug=/api/preview/exit?slug=/'}
              >
                Click here
              </a>{' '}
              to exit
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer layout {...appConfig.footer} />
    </div>
  );
}
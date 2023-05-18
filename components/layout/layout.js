import Header from './header';
import Footer from './footer';
import styles from './layout.module.scss';

export default function Layout({ appConfig, pageTitle, preview, children }) {
  return (
    <div className={styles.layout}>
      <Header siteTitle={appConfig.title} {...appConfig.header} />
      <main className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <Footer layout {...appConfig.footer} />
    </div>
  );
}
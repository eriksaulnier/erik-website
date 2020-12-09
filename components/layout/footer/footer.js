import { HiLightningBolt } from 'react-icons/hi';
import styles from './footer.module.scss'

export default function Footer({ siteTitle }) {
  const date = new Date();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>&copy; 2013-{date.getFullYear()} {siteTitle}</p>

        <p className={styles.poweredBy}>
          <HiLightningBolt title="Powered" />
          <span className="sr-only">Powered</span>{" by "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>
          {", "}
          <a href="https://forestry.io/" target="_blank" rel="noopener noreferrer">
            Forestry
          </a>
          {", and "}
          <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">
            Netlify
          </a>
        </p>
      </div>
    </footer>
  )
}
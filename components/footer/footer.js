import { HiLightningBolt } from 'react-icons/hi';
import styles from './footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2020 Erik Saulnier</p>

        <p className={styles.powered}>
          <HiLightningBolt title="Powered" />
          <span className="sr-only">Powered</span>{" by "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>
          {", "}
          <a href="https://www.contentful.com/" target="_blank" rel="noopener noreferrer">
            Contentful
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
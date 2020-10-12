import { HiLightningBolt } from 'react-icons/hi';
import styles from './footer.module.scss'

export default function Footer() {
  const date = new Date();
  return (
    <footer className={styles.Footer}>
      <div className={styles.Container}>
        <p>&copy; {date.getFullYear()} Erik Saulnier</p>

        <p className={styles.Powered}>
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
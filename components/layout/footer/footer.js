import { HiLightningBolt } from 'react-icons/hi';
import styles from './footer.module.scss'

export default function Footer({ copyright }) {
  const date = new Date();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>&copy; {copyright.year}-{date.getFullYear()} {copyright.text}</p>

        <p className={styles.poweredBy}>
          <HiLightningBolt title="Powered" />
          <span className="sr-only">Powered</span>{' by '}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>
          {', '}
          <a href="https://tina.io" target="_blank" rel="noopener noreferrer">
            TinaCMS
          </a>
          {', and '}
          <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">
            Netlify
          </a>
        </p>
      </div>
    </footer>
  )
}
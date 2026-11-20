import { useEffect, useState } from 'react';
import { FaMountainSun } from 'react-icons/fa6';
import { decodeEmail } from '../../../lib/email.mjs';
import styles from './footer.module.scss';

export default function Footer({ copyright, email }) {
  const date = new Date();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    setAddress(decodeEmail(email));
  }, [email]);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {copyright.year}-{date.getFullYear()} {copyright.text}
        </p>

        <p className={styles.email}>
          {address ? <a href={`mailto:${address}`}>{address}</a> : 'Email'}
        </p>

        <p className={styles.origin}>
          <FaMountainSun aria-hidden="true" />
          Made in Upstate NY
        </p>
      </div>
    </footer>
  );
}

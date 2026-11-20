import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaMountainSun } from 'react-icons/fa6';
import { decodeEmail } from '../../../lib/email.mjs';
import styles from './footer.module.scss';

export default function Footer({ copyright, email }) {
  const date = new Date();
  const [address, setAddress] = useState(null);
  const reduceMotion = useReducedMotion();

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

        <motion.p
          className={styles.origin}
          whileHover={reduceMotion ? undefined : 'hover'}
        >
          <motion.span
            className={styles.originIcon}
            aria-hidden="true"
            variants={{ hover: { y: -2 } }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FaMountainSun />
          </motion.span>
          Made in Upstate NY
        </motion.p>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMountainSun } from 'react-icons/fa6';
import { decodeEmail } from '../../../lib/email.mjs';
import { useHoverLift } from '../../../lib/motion-preference';
import styles from './footer.module.scss';

export default function Footer({ copyright, email }) {
  const date = new Date();
  const [address, setAddress] = useState(null);
  const hoverLift = useHoverLift(2);

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

        <motion.p className={styles.origin} whileHover="hover">
          <motion.span
            className={styles.originIcon}
            aria-hidden="true"
            {...hoverLift}
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

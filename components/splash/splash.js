import { motion } from 'framer-motion'
import styles from './splash.module.scss'

export default function Splash() {
  const pageAnimations = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { staggerChildren: 0.3 } },
    exit: { opacity: 0 }
  }

  const contentAnimations = {
    initial: { y: 20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
  }

  return (
    <motion.div
      className={styles.splash}
      initial="initial" animate="enter" exit="exit"
      variants={pageAnimations}
    >
      <div className={styles.centered}>
        <motion.h1 className={styles.title} variants={contentAnimations}>
          Hey, I'm Erik!
        </motion.h1>
        <motion.h2 className={styles.subtitle} variants={contentAnimations}>
          I'm a full-stack developer who loves turning ideas into code.
        </motion.h2>
      </div>
    </motion.div>
  )
}
import { motion } from 'framer-motion'
import styles from './splash.module.scss'

export default function Splash() {
  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <motion.h1 className={styles.title} layoutId="page-title">Hey, I'm Erik!</motion.h1>
        <motion.h2 className={styles.subtitle}>I'm a full-stack developer who loves turning ideas into code.</motion.h2>
      </div>
    </div>
  )
}
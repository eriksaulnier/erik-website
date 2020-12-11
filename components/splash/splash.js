import { motion } from 'framer-motion'
import styles from './splash.module.scss'

export default function Splash() {
  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <h1 className={styles.title}>Hey, I'm Erik!</h1>
        <h2 className={styles.subtitle}>I'm a full-stack developer who loves turning ideas into code.</h2>
      </div>
    </div>
  )
}
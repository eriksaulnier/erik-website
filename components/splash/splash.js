import { motion } from 'framer-motion'
import styles from './splash.module.scss'

export default function Splash() {
  const title = "Hey, I'm Erik!"
  const titleParts = [...title]
  const subtitle = "I'm a full-stack developer who loves turning ideas into code."
  
  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <motion.h1
          className={styles.title}
          variants={{
            enter: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {titleParts.map((character, index) => (
            <motion.span
              key={index}
              style={{ display: 'inline-block', cursor: 'pointer' }}
              variants={{
                initial: { opacity: 0, y: 15, scaleX: 0.8 },
                enter: { opacity: 1, y: 0, scaleX: 1 },
                hover: { y: -5, scaleX: 0.9 }
              }}
              whileHover="hover"
              transition={{
                type: 'spring',
                stiffness: 250
              }}
            >
              {character === ' ' ? '\xa0' : character}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className={styles.subtitle}
          variants={{
            initial: { opacity: 0, y: 15 },
            enter: { opacity: 1, y: 0 },
          }}
          transition={{
            delay: 0.13 * title.length,
            type: 'spring',
            stiffness: 300
          }}
        >
          {subtitle}
        </motion.h2>
      </div>
    </div>
  )
}
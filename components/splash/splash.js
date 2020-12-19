import { motion } from 'framer-motion'
import styles from './splash.module.scss'
import Typed from 'typed.js'
import { useEffect, useRef } from 'react'

export default function Splash() {
  // TODO: move all these to forestry
  const title = "Hey, I'm Erik!"
  const subtitle = "I'm a || based in Troy, NY."
  const words = [
    'web developer',
    'front-end developer',
    'RPA developer',
    'designer',
    'jack of all trades',
    'gamer'
  ]

  const wordRef = useRef()
  const subtitleDelay = 0.13 * title.length

  useEffect(() => {

    const typed = new Typed(wordRef.current, {
      strings: words,
      typeSpeed: 50,
      backSpeed: 60,
      backDelay: 4000,
      cursorChar: '|',
      loop: true,
      showCursor: false,
      startDelay: (subtitleDelay * 1000) + 3000
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <motion.h1
          className={styles.title}
          variants={{
            enter: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {[...title].map((character, index) => (
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
            delay: subtitleDelay,
            type: 'spring',
            stiffness: 300
          }}
        >
          {subtitle.split('||')[0]}
          <span className={styles.word} ref={wordRef}>{words[0]}</span>
          {subtitle.split('||')[1]}
        </motion.h2>
      </div>
    </div>
  )
}
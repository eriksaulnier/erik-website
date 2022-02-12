import { motion } from 'framer-motion'
import Typed from 'react-typed'
import Particles from 'react-tsparticles'
import { getSiteConfig } from '@/lib/api'
import particleConfig from './particlesjs-config'
import styles from './splash.module.scss'

export default function Splash() {
  const { splash: { title, subtitle, typed_words } } = getSiteConfig()

  const titleWords = title.split(' ')
  const titleParts = titleWords
                      .map((e, i) => i < titleWords.length - 1 ? [e, '\xa0'] : [e])
                      .reduce((a, b) => a.concat(b))
  const subtitleDelay = 0.13 * title.length

  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <motion.h1
          className={styles.title}
          variants={{
            enter: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {titleParts.map((word, index) => (
            <span key={index} className={styles.noBreak}>
              {[...word].map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    initial: { opacity: 0, y: 15, scaleX: 0.8 },
                    enter: { opacity: 1, y: 0, scaleX: 1 },
                    hover: { y: -5, scaleX: 0.9 }
                  }}
                  whileHover="hover"
                  transition={{
                    type: 'spring',
                    stiffness: 300
                  }}
                >{char}</motion.span>
              ))}
            </span>
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
          <Typed
            strings={typed_words}
            className={styles.typed}
            startDelay={(subtitleDelay * 1000) - 1000}
            backDelay={4000}
            typeSpeed={50}
            backSpeed={60}
            cursorChar={'|'}
            contentType={'html'}
            autoInsertCss={false}
            smartBackspace
            loop
          />
          {subtitle.split('||')[1]}
        </motion.h2>
      </div>

      <Particles
        className={styles.background}
        options={particleConfig}
      />
    </div>
  )
}
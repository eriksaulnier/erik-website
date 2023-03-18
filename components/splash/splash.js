import { motion } from 'framer-motion';
import Typed from 'react-typed';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import particleConfig from './particlesjs-config';
import styles from './splash.module.scss';
import { useCallback } from 'react';

export default function Splash({ data: { heading, subheading, typed_words, shuffle_words} }) {
  const headingWords = heading.split(' ');
  const headingParts = headingWords
    .map((e, i) => i < headingWords.length - 1 ? [e, '\xa0'] : [e])
    .reduce((a, b) => a.concat(b));
  const subheadingDelay = 0.13 * heading.length;

  const particlesInit = useCallback(async (engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadSlim(engine);
  }, []);

  return (
    <div className={styles.splash}>
      <div className={styles.centered}>
        <motion.h1
          className={styles.heading}
          variants={{
            enter: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {headingParts.map((word, index) => (
            <span key={index} className={styles.noBreak}>
              {[...word].map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    initial: { opacity: 0, y: 15, scaleX: 0.8 },
                    enter: { opacity: 1, y: 0, scaleX: 1 },
                    // hover: { y: -5, scaleX: 0.9 }
                  }}
                  // whileHover="hover"
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
          className={styles.subheading}
          variants={{
            initial: { opacity: 0, y: 15 },
            enter: { opacity: 1, y: 0 },
          }}
          transition={{
            delay: subheadingDelay,
            type: 'spring',
            stiffness: 300
          }}
        >
          {subheading.split('||')[0]}
          <Typed
            strings={typed_words}
            className={styles.typed}
            startDelay={(subheadingDelay * 1000) - 1000}
            backDelay={4000}
            typeSpeed={50}
            backSpeed={60}
            cursorChar={'|'}
            contentType={'html'}
            autoInsertCss={false}
            shuffle={shuffle_words}
            smartBackspace
            loop
          />
          {subheading.split('||')[1]}
        </motion.h2>
      </div>

      <Particles
        className={styles.background}
        init={particlesInit}
        options={particleConfig}
      />
    </div>
  );
}
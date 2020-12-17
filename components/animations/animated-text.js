import { motion } from 'framer-motion'
import React from 'react'

export default function AnimatedText({ text, element='div', delay, staggerDelay, ...props }) {
  const MotionElement = motion[element]
  return (
    <MotionElement {...props}
      variants={{
        enter: { transition: { staggerChildren: staggerDelay, delay: delay } }
      }}
    >
      {text && [...text].map((character, index) => (
        <motion.span
          key={index}
          style={{ display: 'inline-block', cursor: 'pointer' }}
          variants={{
            initial: { opacity: 0, y: 20, scaleX: 0.8 },
            enter: { opacity: 1, y: 0, scaleX: 1 },
            exit: { opacity: 0, y: 20 },
            hover: { y: -5, scaleX: 0.9 }
          }}
          whileHover="hover"
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {character === ' ' ? '\xa0' : character }
        </motion.span>
      ))}
    </MotionElement>
  )
}
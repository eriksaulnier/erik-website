import { motion } from 'framer-motion'

export default function Custom404() {
  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.h1
        style={{ textAlign: 'center', marginTop: '1em' }}
        variants={{
          initial: { y: 10, opacity: 0 },
          enter: { y: 0, opacity: 1 },
          exit: { y: 5, opacity: 0 },
        }}
      >
        Page Not Found
      </motion.h1>
    </motion.div>
  )
}
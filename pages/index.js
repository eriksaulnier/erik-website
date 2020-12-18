import { motion } from 'framer-motion'
import Splash from '../components/splash';

export default function Home() {
  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { staggerChildren: 0.15 } },
        exit: { opacity: 0 }
      }}
    >
      <Splash />
    </motion.div>
  )
}
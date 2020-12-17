import { motion } from 'framer-motion'
import Splash from '../components/splash';

export default function Home() {
  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.15 } } }}
    >
      <Splash />
    </motion.div>
  )
}
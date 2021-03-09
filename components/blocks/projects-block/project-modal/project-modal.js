import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './project-modal.module.scss'

export default function ProjectModal({ project, reset }) {
  return (
    <motion.div className={styles.projectModal} onClick={reset}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.image}>
          <Image alt={project.title} src={project.thumbnail} layout="fill" />
        </div>
        <div className={styles.content}>
          <motion.h4 className={styles.title}>{project.title}</motion.h4>
        </div>
      </div>
    </motion.div>
  )
}
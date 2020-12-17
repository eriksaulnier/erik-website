import { motion } from 'framer-motion'
import styles from './project-list.module.scss'
import Project from './project';

export default function ProjectList({ projects }) {
  return (
    <motion.div
      className={styles.projectList}
      variants={{
        enter: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {projects?.map((project, index) => (
        <Project data={project} key={index} />
      ))}
    </motion.div>
  )
}
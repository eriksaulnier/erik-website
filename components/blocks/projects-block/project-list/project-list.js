import { motion } from 'framer-motion'
import styles from './project-list.module.scss'
import Project from './project';

export default function ProjectList({ projects }) {
  const listVariants = {
    enter: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <>
      <motion.ul className={styles.projectList} variants={listVariants}>
        {projects?.map((project, index) => (
          <li key={index}>
            <Project data={project} />
          </li>
        ))}
      </motion.ul>
    </>
  )
}
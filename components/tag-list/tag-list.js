// import React from 'react'
// import * as Devicon from 'react-icons/di' 
import { motion } from 'framer-motion'
import styles from './tag-list.module.scss'

export default function TagList({ tags, color }) {
  const listVariants = {
    enter: { transition: { staggerChildren: 0.1 } }
  }
  const tagVariants = {
    initial: { opacity: 0, x: 10 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0 }
  }

  return (
    <motion.ul className={styles.tagList} variants={listVariants}>
      {tags?.map((tag, index) => (
        <motion.li key={index} className={[styles.tag, color ? styles[color] : null].join(' ')} variants={tagVariants}>
          {/* {tag.icon ? React.createElement(Devicon[tag.icon]) : null} */}
          {tag.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}

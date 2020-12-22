import { motion } from 'framer-motion'
import Icon from '../icon'
import styles from './tag-list.module.scss'

export default function TagList({ tags, color }) {
  return (
    <motion.ul
      className={styles.tagList}
      variants={{
        enter: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {tags?.map((tag, index) => (
        <motion.li
          key={index}
          className={[styles.tag, color ? styles[color] : null].join(' ')}
          style={{ cursor: 'pointer' }}
          variants={{
            initial: { opacity: 0, x: 10 },
            enter: { opacity: 1, x: 0 },
            exit: { opacity: 0 },
            hover: { y: -5 }
          }}
          whileHover="hover"
          transition={{
            type: 'spring',
            stiffness: 150
          }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {tag.icon_name && <Icon name={tag.icon_name} />}
          {tag.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}

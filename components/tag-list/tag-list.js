import { motion } from 'framer-motion'
import Icon from '@/components/icon'
import styles from './tag-list.module.scss'

export default function TagList({ tags, className, tagClassName }) {
  return (
    <motion.ul
      className={[styles.tagList, className].join(' ')}
      variants={{
        enter: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {tags?.map((tag, index) => (
        <motion.li
          key={index}
          className={[styles.tag, tagClassName].join(' ')}
          variants={{
            initial: { opacity: 0, x: 10 },
            enter: { opacity: 1, x: 0 },
            exit: { opacity: 0 },
            hover: { y: -2 }
          }}
          whileHover="hover"
          transition={{
            type: 'spring',
            stiffness: 300
          }}
        >
          {tag.icon && <Icon name={tag.icon} />}
          {tag.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}

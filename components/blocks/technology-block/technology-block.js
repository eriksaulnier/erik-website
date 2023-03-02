import { motion } from 'framer-motion'
import styles from './technology-block.module.scss'
import TagList from '@/components/tag-list'

export default function TechnologyBlock({ data: { title, categories } }) {
  return (
    <motion.section className={styles.technologyBlock} variants={{ enter: { transition: { staggerChildren: 0.01 } } }}>
      {title && <h2>{title}</h2>}

      {categories?.map((category, index) => (
        <motion.div
          className={styles.section}
          key={index}
          variants={{
            initial: { y: 10, opacity: 0 },
            enter: { y: 0, opacity: 1 },
            exit: { y: 5, opacity: 0 },
          }}
        >
          {category.label && <h3>{category.label}</h3>}
          <TagList tags={category.technologies} />
        </motion.div>
      ))}
    </motion.section>
  )
}

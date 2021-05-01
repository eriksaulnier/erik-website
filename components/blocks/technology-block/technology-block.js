import { motion } from 'framer-motion'
import styles from './technology-block.module.scss'
import TagList from '@/components/tag-list'

export default function TechnologyBlock({ data: { block_title, categories } }) {
  return (
    <motion.section className={styles.technologyBlock} variants={{ enter: { transition: { staggerChildren: 0.01 } } }}>
      {block_title && <h2>{block_title}</h2>}

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
          {category.category_title && <h3>{category.category_title}</h3>}
          <TagList tags={category.technologies} />
        </motion.div>
      ))}
    </motion.section>
  )
}

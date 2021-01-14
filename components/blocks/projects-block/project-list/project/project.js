import Link from 'next/link'
import { motion } from 'framer-motion'
import TagList from '@/components/tag-list'
import styles from './project.module.scss'

export default function Project({ data: { title, thumbnail, year, stack, links} }) {
  return (
    <motion.div
      className={styles.project}
      whileHover="hover"
      variants={{
        initial: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0 }
      }}
      transition={{
        type: 'spring',
        stiffness: 250
      }}
    >
      <div className={styles.image}>
        <img alt={title} src={thumbnail} />
      </div>

      <motion.div
        className={styles.content}
        variants={{
          initial: { y: 'calc(100% - 3em)' },
          hover: { y: 0 }
        }}
        transition={{
          type: 'spring',
          stiffness: 150
        }}
      >
        <div className={styles.heading}>
          <motion.h4 className={styles.title}>{title}</motion.h4>
          <span className={styles.year}>{year}</span>
        </div>

        {/* <span className={styles.client}>{client}</span> */}

        {stack ? (
          <>
            <h5>Technologies Used</h5>
            <TagList tags={stack} color={'light-2'} />
          </>
        ) : null}

        {/* <p>{description}</p> */}

        <div className={styles.links}>
          {links?.map((item, index) => (
            <Link href={item.link} key={index}>
              <a className="btn">
                {item.title}
              </a>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
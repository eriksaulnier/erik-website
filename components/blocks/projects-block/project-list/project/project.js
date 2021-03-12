import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import TagList from '@/components/tag-list'
import styles from './project.module.scss'

export default function Project({ data }) {
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
        <motion.div variants={{ initial: { opacity: 0.6 }, hover: { opacity: 0.9 } }}>
          <Image alt={data.title} src={data.thumbnail} width="525" height="350" />
        </motion.div>
      </div>

      <div className={styles.content}>
        <motion.h4 className={styles.title}>{data.title}</motion.h4>

        <div className={styles.description}>
          <p>{data.description}</p>
          
          {data.stack && (
            <TagList className={styles.stack} tagClassName={styles.tag} tags={data.stack} />
          )}
        </div>


        {data.links && (
          <div className={styles.buttonList}>
            {data.links?.map((item, index) => (
              <Link href={item.link} key={index}>
                <a className={[styles.button, 'btn'].join(' ')}>
                  {item.title}
                </a>
              </Link>
            ))}
          </div>
        )} 
      </div>

        
    </motion.div>
  )
}
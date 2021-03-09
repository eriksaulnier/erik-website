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
        <motion.div variants={{ initial: { opacity: 0.4 }, hover: { opacity: 0.8 } }}>
          <Image alt={data.title} src={data.thumbnail} width="600" height="400" objectFit="cover" />
        </motion.div>
      </div>

      <div className={styles.content}>
        <motion.h4 className={styles.title}>{data.title}</motion.h4>

        <p className={styles.description}>{data.description}</p>

        {data.stack && <TagList tags={data.stack} color={'light-2'} />}
      </div>
      
        {/* <div className={styles.links}>
          {data.links?.map((item, index) => (
            <Link href={item.link} key={index}>
              <a className="btn">
                {item.title}
              </a>
            </Link>
          ))}
        </div> */}
    </motion.div>
  )
}
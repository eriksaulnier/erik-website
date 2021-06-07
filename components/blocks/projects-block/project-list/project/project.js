import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import TagList from '@/components/tag-list'
import Icon from '@/components/icon'
import styles from './project.module.scss'

export default function Project({ data }) {
  const createdDate = new Date(data.created_date);
  const dateFormat = { month: 'long', year: 'numeric' }

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
        <Image alt={data.title} src={data.thumbnail} width="525" height="350" />
      </div>

      <div className={styles.content}>
        <p className={styles.date}>{createdDate.toLocaleDateString('en-US', dateFormat)}</p>
        <motion.h4 className={styles.title}>{data.title}</motion.h4>
        <p className={styles.description}>{data.description}</p>

        {data.stack && (
          <TagList className={styles.stack} tagClassName={styles.tag} tags={data.stack} />
        )}

        {data.links && (
          <div className={styles.buttonList}>
            {data.links?.map((item, index) => (
              <Link href={item.link} key={index}>
                <a className={[styles.button, 'btn'].join(' ')} target="blank">
                  {item.title}
                  {item.icon_name && <Icon name={item.icon_name} />}
                </a>
              </Link>
            ))}
          </div>
        )} 
      </div>
    </motion.div>
  )
}
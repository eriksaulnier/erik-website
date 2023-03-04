import Link from 'next/link'
import Image from 'next/image';
import { motion } from 'framer-motion'
import TagList from '@/components/tag-list'
import Icon from '@/components/icon'
import styles from './project.module.scss'

export default function Project({ data }) {
  const project = data.node || data;
  const publishDate = new Date(project.publish_date);

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
      <div className={styles.heading}>
        <p className={styles.date}>{publishDate.getFullYear()}</p>
        <motion.h4 className={styles.title}>{project.name}</motion.h4>
      </div>
      <div className={styles.image}>
        <Image
          {...project.image}
          alt={project.name}
          placeholder="blur"
          style={{
            width: '100%',
            height: 'auto'
          }}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{project.description}</p>

        {project.technologies && (
          <TagList className={styles.stack} tagClassName={styles.tag} tags={project.technologies} />
        )}

        {project.links && (
          <div className={styles.buttonList}>
            {project.links?.map((item, index) => (
              <Link href={item.href} key={index} className={[styles.button, 'btn'].join(' ')} target="blank">
                {item.title}
                {item.icon && <Icon name={item.icon} />}
              </Link>
            ))}
          </div>
        )} 
      </div>
    </motion.div>
  );
}
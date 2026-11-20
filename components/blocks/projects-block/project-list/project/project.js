import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import TagList from '@/components/tag-list';
import Icon from '@/components/icon';
import styles from './project.module.scss';

export default function Project({ data }) {
  const project = data;
  const thumbnail = project.thumbnail;
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.project}
      whileHover="hover"
      variants={{
        initial: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0 },
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
      }}
    >
      <div className={styles.heading}>
        <p className={styles.date}>{project.publish_date.slice(0, 4)}</p>
        <motion.h4 className={styles.title}>{project.name}</motion.h4>
      </div>
      {thumbnail?.src && (
        <motion.div
          className={styles.image}
          variants={reduceMotion ? undefined : { hover: { y: -4 } }}
          transition={{ type: 'spring', stiffness: 250 }}
        >
          <Image
            {...thumbnail}
            alt={thumbnail.alt || project.name}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </motion.div>
      )}
      <div className={styles.content}>
        <p className={styles.description}>{project.description}</p>

        {project.technologies && (
          <TagList
            className={styles.stack}
            tagClassName={styles.tag}
            tags={project.technologies}
          />
        )}

        {project.links && (
          <div className={styles.buttonList}>
            {project.links?.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={[styles.button, 'btn'].join(' ')}
                target="blank"
              >
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

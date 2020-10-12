import styles from './project.module.scss'

export default function Project({ project }) {
  return (
    <div className={styles.project}>
      <div className={styles.header}>
        <h4 className={styles.title}>{project.title}</h4>
        <span className={styles.year}>{project.year}</span>
      </div>
      
      <div className={styles.image}>
        <img src={project.thumbnail} />
      </div>
    </div>
  )
}
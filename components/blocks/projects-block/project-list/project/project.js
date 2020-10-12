import styles from './project.module.scss'

export default function Project({ data }) {
  return (
    <div className={styles.Project}>
      <div className={styles.header}>
        <h4 className={styles.title}>{data.title}</h4>
        <span className={styles.year}>{data.year}</span>
      </div>
      
      <div className={styles.image}>
        <img src={data.thumbnail} />
      </div>
    </div>
  )
}
import TagList from '../../../../tag-list'
import styles from './project.module.scss'

export default function Project({ data }) {
  console.log(data)
  return (
    <div className={styles.project}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <h4 className={styles.title}>{data.title}</h4>
          <span className={styles.year}>{data.year}</span>
        </div>
        
        {data.stack ? (
          <>
            <p>Stack: </p>
            <TagList tags={data.stack} color={'dark-2'} />
          </>
        ) : null}
        
        {/* <p>{data.description}</p> */}
      </div>
      
      <div className={styles.image}>
        <img alt={data.title} src={data.thumbnail} />
      </div>
    </div>
  )
}
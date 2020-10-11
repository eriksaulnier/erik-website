import styles from './../form-block.module.scss'

export default function TextareaField({ data }) {
  return (
    <div className={styles.Field} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className={styles.TextareaField}>
        <textarea name={data.name} placeholder={data.placeholder}/>
      </div>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
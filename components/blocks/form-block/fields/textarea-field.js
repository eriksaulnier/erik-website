import styles from './../form-block.module.scss'

export default function TextareaField({ data }) {
  return (
    <div className={[styles.Field, styles.TextareaField].join(' ')} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <textarea id={data.name} name={data.name} placeholder={data.placeholder}/>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
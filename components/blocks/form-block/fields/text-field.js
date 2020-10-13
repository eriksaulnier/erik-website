import styles from './../form-block.module.scss'

export default function TextField({ data }) {
  return (
    <div className={[styles.Field, styles.TextField].join(' ')} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <input id={data.name} name={data.name} type="text" placeholder={data.placeholder}/>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
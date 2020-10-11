import styles from './../form-block.module.scss'

export default function TextField({ data }) {
  return (
    <div className={styles.Field} width={data.width||100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className={styles.TextField}>
        <input name={data.name} type="text" placeholder={data.placeholder}/>
      </div>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
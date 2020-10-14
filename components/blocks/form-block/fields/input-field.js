import styles from './../form-block.module.scss'

export default function InputField({ data }) {
  return (
    <div className={[styles.Field, styles.InputField].join(' ')} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <input id={data.name} name={data.name} type={data.input_type || 'text'} placeholder={data.input_placeholder}/>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
import styles from './../form-block.module.scss'

export default function RadioField({ data }) {
  return (
    <div className={[styles.Field, styles.RadioField].join(' ')} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      {data.radio_options.map((option, index) => (
        <div key={index}>
          <input id={data.name} type="radio" name={data.name} value={option.value}/>
          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
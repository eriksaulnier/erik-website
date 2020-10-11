import styles from './../form-block.module.scss'

export default function RadioField({ data }) {
  return (
    <div className={styles.Field} width={data.width||100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className={styles.RadioField}>
        {data.radio_options.map((option, index) => (
          <div key={index}>
            <input type="radio" name={data.name} value={option.value}/>
            <label htmlFor={option.value}>{option.label}</label>
          </div>
        ))}
      </div>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
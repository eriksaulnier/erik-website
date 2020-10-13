import styles from './../form-block.module.scss'

export default function RadioField({ data }) {
  return (
    <fieldset className={[styles.Field, styles.RadioField].join(' ')} width={data.width || 100}>
      {data.label ? <legend>{data.label}</legend> : null}
      {data.radio_options.map((option, index) => (
        <div key={index}>
          <input id={data.name+index} type="radio" name={data.name} value={option.value}/>
          <label htmlFor={data.name+index}>{option.label}</label>
        </div>
      ))}
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </fieldset>
  )
}
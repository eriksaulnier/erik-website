import styles from './../form-block.module.scss'

export default function SelectField({ data }) {
  return (
    <div className={[styles.Field, styles.SelectField].join(' ')} width={data.width || 100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <select id={data.name} required={data.required} >
        {data.select_options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
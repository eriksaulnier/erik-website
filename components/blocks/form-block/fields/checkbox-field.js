import styles from './../form-block.module.scss'

export default function CheckboxField({ data }) {
  return (
    <div className={[styles.Field, styles.CheckboxField].join(' ')} width={data.width||100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      {data.checkbox_options.map((option, index) => (
        <div key={index}>
          <input id={data.name} type="checkbox" name={data.name+'[]'} value={option.value} />
          <label htmlFor={data.name}>{option.label}</label>
        </div>
      ))}
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
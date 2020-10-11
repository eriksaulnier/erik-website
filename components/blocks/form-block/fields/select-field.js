import styles from './../form-block.module.scss'

export default function SelectField({ data }) {
  return (
    <div className={styles.Field} width={data.width||100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className={styles.SelectField}>
        <select>
          {data.select_options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
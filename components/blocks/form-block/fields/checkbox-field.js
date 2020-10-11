import styles from './../form-block.module.scss'

export default function CheckboxField({ data }) {
  return (
    <div className={styles.Field} width={data.width||100}>
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className={styles.CheckboxField}>
        {data.checkbox_options.map((option, index) => (
          <div key={index}>
            <input type="checkbox" name={data.name+index} value={option.value} />
            <label htmlFor={data.name+index}>{option.label}</label>
          </div>
        ))}
      </div>
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </div>
  )
}
import styles from './../form-block.module.scss'

export default function CheckboxField({ data }) {
  return (
    <fieldset className={[styles.Field, styles.CheckboxField].join(' ')} width={data.width||100}>
      {data.label ? <legend htmlFor={data.name}>{data.label}</legend> : null}
      {data.checkbox_options.map((option, index) => (
        <div key={index}>
          <input id={data.name+index} type="checkbox" name={data.name+'[]'} value={option.value} />
          <label htmlFor={data.name+index}>{option.label}</label>
        </div>
      ))}
      {data.description ? <p className={styles.Description}>{data.description}</p> : null}
    </fieldset>
  )
}
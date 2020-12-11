import styles from './../form-block.module.scss'

export default function CheckboxField({
  data: {
    label,
    name,
    checkbox_options,
    description,
    width
  }
}) {
  return (
    <fieldset className={[styles.field, styles.checkboxField].join(' ')} width={width||100}>
      {label && <legend htmlFor={data.name}>{data.label}</legend>}

      {checkbox_options?.map((option, index) => (
        <div key={index}>
          <input id={name+index} type="checkbox" name={name+'[]'} value={option.value} />
          <label htmlFor={name+index}>{option.label}</label>
        </div>
      ))}

      {description && <p className={styles.description}>{description}</p>}
    </fieldset>
  )
}
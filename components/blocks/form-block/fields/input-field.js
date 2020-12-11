import styles from './../form-block.module.scss'

export default function InputField({
  data: {
    label,
    name,
    required,
    input_type,
    input_placeholder,
    description,
    width
  }
}) {
  return (
    <div className={[styles.field, styles.inputField].join(' ')} width={width || 100}>
      {label && <label htmlFor={name}>{label}</label>}

      <input id={name} name={name} required={required} type={input_type || 'text'} placeholder={input_placeholder}/>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
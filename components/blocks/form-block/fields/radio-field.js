import { motion } from 'framer-motion'
import styles from './../form-block.module.scss'

export default function RadioField({
  data: {
    label,
    name,
    description,
    required,
    options,
    width
  },
  variants
}) {
  return (
    <motion.fieldset
      className={[styles.field, styles.radioField, required && styles.required].join(' ')}
      width={width || 100}
      variants={variants}
    >
      {label && <label htmlFor={name}>{label}</label>}

      {options?.map((option, index) => (
        <div key={index}>
          <input id={name+index} type="radio" name={name} required={required} value={option.value}/>
          <label htmlFor={name+index}>{option.label}</label>
        </div>
      ))}

      {description && <p className={styles.description}>{description}</p>}
    </motion.fieldset>
  )
}
import { motion } from 'framer-motion'
import styles from './../form-block.module.scss'

export default function SelectField({
  data: {
    label,
    name,
    required,
    select_options,
    description,
    width
  },
  variants
}) {
  return (
    <motion.div
      className={[styles.field, styles.selectField].join(' ')}
      width={width || 100}
      variants={variants}
    >
      {label && <label htmlFor={name}>{label}</label>}

      <select id={name} required={required}>
        {select_options?.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>

      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  )
}
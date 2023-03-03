import { motion } from 'framer-motion'
import styles from './../form-block.module.scss'

export default function TextareaField({
  data: {
    label,
    name,
    description,
    required,
    placeholder,
    rows,
    width
  },
  variants
}) {
  return (
    <motion.div
      className={[styles.field, styles.textareaField, required && styles.required].join(' ')}
      width={width || 100}
      variants={variants}
    >
      {label && <label htmlFor={name}>{label}</label>}

      <textarea id={name} name={name} required={required} rows={rows} placeholder={placeholder}/>
      
      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  )
}
import { motion } from 'framer-motion'
import styles from './../form-block.module.scss'

export default function TextareaField({
  data: {
    label,
    name,
    required,
    textarea_placeholder,
    description,
    width
  },
  variants
}) {
  return (
    <motion.div
      className={[styles.field, styles.textareaField].join(' ')}
      width={width || 100}
      variants={variants}
    >
      {label && <label htmlFor={name}>{label}</label>}

      <textarea id={name} name={name} required={required} placeholder={textarea_placeholder}/>
      
      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  )
}
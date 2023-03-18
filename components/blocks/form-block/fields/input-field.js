import { motion } from 'framer-motion';
import styles from './../form-block.module.scss';

export default function InputField({
  data: {
    label,
    name,
    description,
    required,
    placeholder,
    type,
    width
  },
  variants
}) {
  return (
    <motion.div
      className={[styles.field, styles.inputField, required && styles.required].join(' ')}
      width={width || 100}
      variants={variants}
    >
      {label && <label htmlFor={name}>{label}</label>}

      <input id={name} name={name} required={required} type={type || 'text'} placeholder={placeholder}/>

      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  );
}
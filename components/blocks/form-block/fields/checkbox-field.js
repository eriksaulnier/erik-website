import { motion } from 'framer-motion';
import styles from './../form-block.module.scss';

export default function CheckboxField({
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
      className={[styles.field, styles.checkboxField, required && styles.required].join(' ')}
      width={width||100}
      variants={variants}
    >
      {label && <legend htmlFor={name}>{label}</legend>}

      {options?.map((option, index) => (
        <div key={index}>
          <input id={name+index} type="checkbox" name={name+'[]'} value={option.value} />
          <label htmlFor={name+index}>{option.label}</label>
        </div>
      ))}

      {description && <p className={styles.description}>{description}</p>}
    </motion.fieldset>
  );
}
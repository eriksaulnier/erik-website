import { motion } from 'framer-motion'
import { InputField, TextareaField, SelectField, RadioField, CheckboxField } from './fields'
import styles from './form-block.module.scss'

export default function FormBlock({ data: { block_title, form_name, fields, submit_text } }) {
  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  }

  return (
    <motion.section className={styles.formBlock} variants={{ enter: { transition: { staggerChildren: 0.1 } } }}>
      {block_title && <h2>{block_title}</h2>}

      <form name={form_name} method="POST" data-netlify="true" netlify-honeypot="verification">
        <input type="hidden" name="form-name" value={form_name} />
        <input type="hidden" name="verification" />

        <div className={styles.fieldGroup}>
          {fields?.map((field, index) => {
            switch (field.field_type) {
              case 'Input':
                return <InputField key={index} data={field} variants={fieldVariants} />
              case 'Textarea':
                return <TextareaField key={index} data={field} variants={fieldVariants} />
              case 'Select':
                return <SelectField key={index} data={field} variants={fieldVariants} />
              case 'Radio':
                return <RadioField key={index} data={field} variants={fieldVariants} />
              case 'Checkbox':
                return <CheckboxField key={index} data={field} variants={fieldVariants} />
            }
          })}
        </div>

        <motion.button type="submit" variants={fieldVariants}>{submit_text}</motion.button>
      </form>
    </motion.section>
  )
}
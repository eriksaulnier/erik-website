import { motion } from 'framer-motion'
import { InputField, TextareaField, SelectField, RadioField, CheckboxField } from './fields'
import styles from './form-block.module.scss'

export default function FormBlock({ data: { title, name, fields, submit_label, ...props } }) {
  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  }
  const typenamePrefix = 'PagesBlocksBlocksFormFields';

  return (
    <motion.section className={styles.formBlock} variants={{ enter: { transition: { staggerChildren: 0.1 } } }}>
      {title && <h2>{title}</h2>}

      <form name={name} method="POST" data-netlify="true" netlify-honeypot="verification">
        {name && <input type="hidden" name="form-name" value={name} />}
        <input type="hidden" name="verification" />

        <div className={styles.fieldGroup}>
          {fields?.map((field, index) => {
            switch (field.__typename) {
            case `${typenamePrefix}Input`:
              return <InputField key={index} data={field} variants={fieldVariants} />
            case `${typenamePrefix}Textarea`:
              return <TextareaField key={index} data={field} variants={fieldVariants} />
            case `${typenamePrefix}Select`:
              return <SelectField key={index} data={field} variants={fieldVariants} />
            case `${typenamePrefix}Radio`:
              return <RadioField key={index} data={field} variants={fieldVariants} />
            case `${typenamePrefix}Checkbox`:
              return <CheckboxField key={index} data={field} variants={fieldVariants} />
            }
          })}
        </div>

        <button type="submit" variants={fieldVariants}>{submit_label || 'Submit'}</button>
      </form>
    </motion.section>
  )
}
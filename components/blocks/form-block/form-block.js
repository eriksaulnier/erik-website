import { InputField, TextareaField, SelectField, RadioField, CheckboxField } from './fields'
import styles from './form-block.module.scss'

export default function FormBlock({ data: { block_title, form_name, fields, submit_text } }) {
  return (
    <section className={styles.formBlock}>
      {block_title && <h2>{block_title}</h2>}

      <form name={form_name} method="POST" data-netlify="true" netlify-honeypot="verification">
        <input type="hidden" name="form-name" value={form_name} />
        <input type="hidden" name="verification" />

        <div className={styles.fieldGroup}>
          {fields?.map((field, index) => {
            switch (field.field_type) {
              case 'Input':
                return <InputField key={index} data={field} />
              case 'Textarea':
                return <TextareaField key={index} data={field} />
              case 'Select':
                return <SelectField key={index} data={field} />
              case 'Radio':
                return <RadioField key={index} data={field} />
              case 'Checkbox':
                return <CheckboxField key={index} data={field} />
            }
          })}
        </div>

        <button type="submit">{submit_text}</button>
      </form>
    </section>
  )
}
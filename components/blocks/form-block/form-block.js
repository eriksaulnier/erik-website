import { TextField, TextareaField, SelectField, RadioField, CheckboxField } from './fields'
import styles from './form-block.module.scss'

export default function FormBlock({ data }) {
  return (
    <section className={styles.FormBlock}>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      <form name={data.form_name} method="POST" netlify netlify-honeypot="verification">
        <input type="hidden" name="form-name" value={data.form_name} />
        <input type="hidden" name="verification" />

        <div className={styles.FieldGroup}>
          {data.fields.map((field, index) => {
            switch (field.field_type) {
              case 'Text':
                return <TextField key={index} data={field} />
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

        <button type="submit">{data.submit_text}</button>
      </form>
    </section>
  )
}
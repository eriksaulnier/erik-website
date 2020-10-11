import { TextField, TextareaField, SelectField, RadioField, CheckboxField } from './fields'

export default function FormBlock({ data }) {
  return (
    <section>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

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
    </section>
  )
}
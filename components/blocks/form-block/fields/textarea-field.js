export default function TextareaField({ data }) {
  return (
    <div className="form-field">
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className="control">
        <textarea className="textarea-field" name={data.name} placeholder={data.placeholder}/>
      </div>
    </div>
  )
}
export default function CheckboxField({ data }) {
  return (
    <div className="form-field">
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className="control">
        {data.checkbox_options.map((option, index) => (
          <div key={index}>
            <input type="checkbox" name={data.name+index} value={option.value} />
            <label htmlFor={data.name+index}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
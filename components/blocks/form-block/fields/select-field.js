export default function SelectField({ data }) {
  return (
    <div className="form-field">
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className="control">
        <select>
          {data.select_options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
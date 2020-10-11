export default function RadioField({ data }) {
  return (
    <div className="form-field">
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className="control">
        {data.radio_options.map((option, index) => (
          <div key={index}>
            <input type="radio" name={data.name} value={option.value}/>
            <label htmlFor={option.value}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
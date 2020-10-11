export default function TextField({ data }) {
  return (
    <div className="form-field">
      {data.label ? <label htmlFor={data.name}>{data.label}</label> : null}
      <div className="control">
        <input className="text-field" name={data.name} type="text" placeholder={data.placeholder}/>
      </div>
    </div>
  )
}
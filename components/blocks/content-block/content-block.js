export default function ContentBlock({ data }) {
  return (
    <section>
      {data.block_title ? <h2>{data.block_title}</h2> : null}
      
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </section>
  )
}
import Link from 'next/link'
import ReactMarkdown from 'react-markdown/with-html'

export default function ContentBlock({ data }) {
  return (
    <section>
      {data.block_title ? <h2>{data.block_title}</h2> : null}
      
      {data.content && <ReactMarkdown
        source={data.content}
        escapeHtml={false}
        renderers={{
            link: ({ children, href }) => {
                return (
                    <Link href={href}>
                        <a>{children}</a>
                    </Link>
                );
            },
        }}
      />}
    </section>
  )
}
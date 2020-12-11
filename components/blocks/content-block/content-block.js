import Link from 'next/link'
import ReactMarkdown from 'react-markdown/with-html'

export default function ContentBlock({ data: { block_title, content }}) {
  return (
    <section>
      {block_title && <h2>{block_title}</h2>}
      
      {content && (
        <ReactMarkdown
          source={content}
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
        />
      )}
    </section>
  )
}
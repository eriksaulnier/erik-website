import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown/with-html'
import styles from './content-block.module.scss'

export default function ContentBlock({ data: { block_title, content, aside_image }}) {
  return (
    <section className={styles.contentBlock}>
      {content && (
        <div className={styles.content}>
          {block_title && <h2>{block_title}</h2>}

          <ReactMarkdown
            source={content}
            escapeHtml={false}
            className={styles.content}
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
        </div>
      )}

      {aside_image && (
        <div className={styles.asideImage}>
          <Image src={aside_image} width="500" height="500" objectFit="cover" />
        </div>
      )}
    </section>
  )
}
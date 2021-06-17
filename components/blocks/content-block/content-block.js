import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import styles from './content-block.module.scss'

export default function ContentBlock({ data: { block_title, content, aside_image }}) {
  return (
    <section className={styles.contentBlock}>
      {content && (
        <div className={styles.content}>
          {block_title && <h2>{block_title}</h2>}

          <Markdown
            children={content}
            className={styles.content}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
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
          <Image
            src={aside_image.image}
            alt={aside_image.alt}
            width="280"
            height="280"
            layout="responsive"
          />
        </div>
      )}
    </section>
  )
}
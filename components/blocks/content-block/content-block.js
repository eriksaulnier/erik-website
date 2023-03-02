import Link from 'next/link'
import Image from 'next/image';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import styles from './content-block.module.scss'

export default function ContentBlock({ data: { title, body, aside_image }}) {
  return (
    <section className={styles.contentBlock}>
      {body && (
        <div className={styles.content}>
          {title && <h2>{title}</h2>}

          <TinaMarkdown
            content={body}
            className={styles.content}
            components={{
              a: ({ url, children }) => {
                return (
                  <Link href={url}>
                    {children}
                  </Link>
                );
              },
            }}
          />
        </div>
      )}

      {(aside_image && aside_image.image) && (
        <div className={styles.asideImage}>
          <Image
            src={aside_image.image}
            alt={aside_image.alt}
            width="280"
            height="280"
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </div>
      )}
    </section>
  );
}
import Link from 'next/link'
import Image from 'next/image';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import styles from './content-block.module.scss'

export default function ContentBlock({ data: { title, body, aside_image }}) {
  console.log('aside_image', aside_image);
  return (
    <section className={styles.contentBlock}>
      {(aside_image && aside_image.image) && (
        <div className={styles.asideImage}>
          <Image
            {...aside_image.image}
            alt={aside_image.name}
            placeholder="blur"
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </div>
      )}

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
    </section>
  );
}
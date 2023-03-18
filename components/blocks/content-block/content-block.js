import Link from 'next/link';
import Image from 'next/image';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import styles from './content-block.module.scss';

export default function ContentBlock({ data: { title, body, aside_image }}) {
  return (
    <section className={styles.contentBlock}>
      {(aside_image && aside_image.src) && (
        <div className={styles.asideImage}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            {...aside_image}
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
                const external = url.startsWith('http');
                return (
                  <Link href={url} target={external ? '_blank' : '_self'}>
                    {children}
                  </Link>
                );
              },
              image: ({ type, ...props }) => {
                return (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image
                    {...props}
                    style={{
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                );
              }
            }}
          />
        </div>
      )}
    </section>
  );
}
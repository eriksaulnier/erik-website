import Link from 'next/link'
import Image from 'next/image';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import blurHashToDataURL from '@/lib/blurhash'
import styles from './content-block.module.scss'

export default function ContentBlock({ data: { title, body, aside_image }}) {
  const asideBlurDataUrl = aside_image?.blurhash && blurHashToDataURL(aside_image.blurhash, aside_image.width, aside_image.height);

  return (
    <section className={styles.contentBlock}>
      {(aside_image && aside_image.src) && (
        <div className={styles.asideImage}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            {...aside_image}
            blurDataURL={asideBlurDataUrl}
            placeholder={asideBlurDataUrl ? 'blur' : 'empty'}
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
              image: ({ type, ...props }) => {
                const blurDataUrl = props.blurhash && blurHashToDataURL(props.blurhash, props.width, props.height);
                return (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image
                    {...props}
                    blurDataURL={blurDataUrl}
                    placeholder={blurDataUrl ? 'blur' : 'empty'}
                  />
                )
              }
            }}
          />
        </div>
      )}
    </section>
  );
}
import Image from 'next/image';
import { renderMarkdoc } from '@/lib/markdoc';
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

          {renderMarkdoc(body)}
        </div>
      )}
    </section>
  );
}

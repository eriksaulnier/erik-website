import Link from 'next/link';
import styles from './article.module.scss'

export default function Article({ data }) {
  
  return (
    <div className={styles.article}>
      <Link href={'/articles/[...slug]'} as={`/articles/${data.slug}`}>
          <a>
            {data.article_title}
          </a>
      </Link>
    </div>
  )
}
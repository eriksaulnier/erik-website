import Link from 'next/link';
import styles from './post.module.scss'

export default function Post({ data }) {
  const post = data.node || data;
  const url = post._sys ? `/${post._sys.path.replace('.mdx', '')}` : `/${post.id.replace('.mdx', '')}`;
  return (
    <div className={styles.post}>
      <Link href={url}>
        {post.title}
      </Link>
    </div>
  )
}
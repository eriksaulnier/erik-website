import styles from './article-list.module.scss'
import Article from './article';

export default function ArticleList({ articles }) {
  return (
    <>
      <ul className={styles.articleList}>
        {articles?.map((article, index) => (
          <li key={index}>
            <Article data={article} />
          </li>
        ))}
      </ul>
    </>
  )
}
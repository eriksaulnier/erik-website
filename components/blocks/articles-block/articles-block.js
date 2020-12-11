import ArticleList from './article-list'

export default function ArticlesBlock({ data: { block_title, articles } }) {
  return (
    <section>
      {block_title && <h2>{block_title}</h2>}

      {articles && (
        <ArticleList articles={articles} />
      )}
    </section>
  )
}

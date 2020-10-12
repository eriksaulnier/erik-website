import ArticleList from './article-list'

export default function ArticlesBlock({ data }) {
  return (
    <section>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      {data.articles ? <ArticleList articles={data.articles} /> : null}
    </section>
  )
}

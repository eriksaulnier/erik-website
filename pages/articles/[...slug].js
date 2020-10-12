import ReactMarkdown from 'react-markdown/with-html'
import { getSiteSettings, getAllArticlePaths, getArticleBySlug } from '../../lib/api'
import { Layout } from '../../components/layout'

export default function Article({ site, article_title, created_date, content }) {
  const date = new Date(created_date)
  const formattedDate = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Layout site={site} pageTitle={article_title}>
      <div className="container mx-auto">
        <h1>{article_title}</h1>
        <p><b>Posted {formattedDate}</b></p>

        {content ? (
          <section>
            <ReactMarkdown escapeHtml={false} source={content} />
          </section>
        ) : null}
      </div>
    </Layout>
  )
}

export function getStaticProps({ params: { slug } }) {
  const site = getSiteSettings()
  const data = getArticleBySlug(slug.join('/'))
  
  data.created_date = Date.parse(data.created_date)

  return { props: { site, ...data } }
}

export function getStaticPaths() {
  const paths = getAllArticlePaths()
  const formattedPaths = paths.map(path => {
    return { params: { slug: path } }
  })

  return { paths: formattedPaths, fallback: false }
}
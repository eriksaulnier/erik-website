import ReactMarkdown from 'react-markdown/with-html'
import { motion } from 'framer-motion'
import { getAllArticlePaths, getArticleBySlug } from '../../lib/api'

export default function Article({ article_title, created_date, content }) {
  const date = new Date(created_date)
  const formattedDate = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <motion.div>
      <div className="container mx-auto">
        <h1>{article_title}</h1>
        <p><b>Posted {formattedDate}</b></p>

        {content ? (
          <section>
            <ReactMarkdown escapeHtml={false} source={content} />
          </section>
        ) : null}
      </div>
    </motion.div>
  )
}

export function getStaticProps({ params: { slug } }) {
  const data = getArticleBySlug(slug.join('/'))
  
  data.created_date = Date.parse(data.created_date)

  return { props: { ...data } }
}

export function getStaticPaths() {
  const paths = getAllArticlePaths()
  const formattedPaths = paths.map(path => {
    return { params: { slug: path } }
  })

  return { paths: formattedPaths, fallback: false }
}
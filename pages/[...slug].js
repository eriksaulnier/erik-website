import ReactMarkdown from 'react-markdown/with-html'
import { motion } from 'framer-motion'
import { getSiteSettings, getAllPagePaths, getPageBySlug } from '../lib/api'
import { Layout } from '../components/layout'
import { ContentBlock, TechnologyBlock, FormBlock, ProjectsBlock, ArticlesBlock } from '../components/blocks'

export default function Page({ site, content, page_title, tab_title, blocks }) {
  return (
    <Layout site={site} pageTitle={tab_title}>
      <motion.h1 layoutId="page-title">{page_title}</motion.h1>

      {content ? (
        <section>
          <ReactMarkdown escapeHtml={false} source={content} />
        </section>
      ) : null}

      {blocks?.map((block, index) => (
        <motion.div 
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { delay: 0.4 } }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {
            {
              'content-block': <ContentBlock data={block} />,
              'technology-block': <TechnologyBlock data={block} />,
              'form-block': <FormBlock data={block} />,
              'projects-block': <ProjectsBlock data={block} />,
              'articles-block': <ArticlesBlock data={block} />
            }[block.template]
          }
        </motion.div>
      ))}
    </Layout>
  )
}

export function getStaticProps({ params: { slug } }) {
  const site = getSiteSettings()
  const data = getPageBySlug(slug.join('/'))

  return { props: { site, ...data } }
}

export function getStaticPaths() {
  const paths = getAllPagePaths()
  const formattedPaths = paths.map(path => {
    return { params: { slug: path } }
  })
  
  return { paths: formattedPaths, fallback: false }
}
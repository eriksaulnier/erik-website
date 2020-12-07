import ReactMarkdown from 'react-markdown/with-html'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllPagePaths, getPageBySlug } from '../lib/api'
import { ContentBlock, TechnologyBlock, FormBlock, ProjectsBlock, ArticlesBlock } from '../components/blocks'

export default function Page({ content, page_title, tab_title, blocks }) {
  return (
    <motion.div>
      <motion.h1 layoutId="page-title">{page_title}</motion.h1>

      {content ? (
        <section>
          <ReactMarkdown escapeHtml={false} source={content} />
        </section>
      ) : null}

      <AnimatePresence>
        {blocks?.map((block, index) => (
          <motion.div
            key={`block-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
      </AnimatePresence>
    </motion.div>
  )
}

export function getStaticProps({ params: { slug } }) {
  const data = getPageBySlug(slug.join('/'))

  return { props: { ...data } }
}

export function getStaticPaths() {
  const paths = getAllPagePaths()
  const formattedPaths = paths.map(path => {
    return { params: { slug: path } }
  })
  
  return { paths: formattedPaths, fallback: false }
}
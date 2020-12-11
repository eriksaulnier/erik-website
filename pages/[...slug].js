import ReactMarkdown from 'react-markdown/with-html'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllPagePaths, getPageBySlug } from '../lib/api'
import { ContentBlock, TechnologyBlock, FormBlock, ProjectsBlock, ArticlesBlock } from '../components/blocks'

export default function Page({ slug, content, page_title, blocks }) {
  const contentAnimations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  }

  return (
    <motion.div>

      <AnimatePresence>
        {blocks?.map((block, index) => (
            <motion.div key={`${slug}-${index}`} {...contentAnimations}>
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
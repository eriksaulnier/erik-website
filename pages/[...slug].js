import { motion } from 'framer-motion'
import { getAllPagePaths, getPageBySlug } from '@/lib/api'
import * as Blocks from '@/components/blocks'

export default function Page({ slug, page_title, blocks }) {
  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.h1
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 }
        }}
      >
        {page_title}
      </motion.h1>

      {blocks?.map((block, index) => (
        <motion.div
          key={`${slug}-${index}`}
          variants={{
            initial: { y: 10, opacity: 0 },
            enter: { y: 0, opacity: 1 },
            exit: { y: 5, opacity: 0 },
          }}
        >
          {
            {
              'content-block': <Blocks.ContentBlock data={block} />,
              'technology-block': <Blocks.TechnologyBlock data={block} />,
              'form-block': <Blocks.FormBlock data={block} />,
              'projects-block': <Blocks.ProjectsBlock data={block} />,
              'articles-block': <Blocks.ArticlesBlock data={block} />,
              'spotify-block': <Blocks.SpotifyBlock data={block} />
            }[block.template]
          }
        </motion.div>
      ))}
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
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { motion } from 'framer-motion'
import { getAllArticlePaths, getArticleBySlug } from '@/lib/api'

export default function Article({ article_title, created_date, content }) {
  const contentAnimations = {
    initial: { y: 20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  }
  
  const date = new Date(created_date)
  const formattedDate = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h1 variants={contentAnimations}>{article_title}</motion.h1>
      <p><b>Posted {formattedDate}</b></p>
    
      {content && <Markdown
        children={content}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          link: ({ children, href }) => {
            return (
              <Link href={href}>
                <a>{children}</a>
              </Link>
            );
          },
        }}
      />}
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
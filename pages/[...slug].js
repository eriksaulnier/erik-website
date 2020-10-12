import ReactMarkdown from 'react-markdown/with-html'
import { getSiteSettings, getAllPagePaths, getPageBySlug } from '../lib/api'
import { Layout } from '../components/layout'
import { ContentBlock, TechnologyBlock, FormBlock, ProjectsBlock, ArticlesBlock } from '../components/blocks'

export default function Page({ site, content, page_title, tab_title, blocks }) {
  return (
    <Layout site={site} pageTitle={tab_title}>
      <div>
        <h1>{page_title}</h1>

        {content ? (
          <section>
            <ReactMarkdown escapeHtml={false} source={content} />
          </section>
        ) : null}

        {blocks?.map((block, index) => {
          switch (block.template) {
            case 'content-block':
              return <ContentBlock key={index} data={block} />
            case 'technology-block':
              return <TechnologyBlock key={index} data={block} />
            case 'form-block':
              return <FormBlock key={index} data={block} />
            case 'projects-block':
              return <ProjectsBlock key={index} data={block} />
            case 'articles-block':
              return <ArticlesBlock key={index} data={block} />
          }
        })}
      </div>
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
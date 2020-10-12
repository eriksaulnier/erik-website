import ReactMarkdown from 'react-markdown/with-html'
import { getSiteSettings, getAllPagePaths, getPageBySlug } from '../lib/api'
import { Layout } from '../components/layout'
import { ContentBlock, TechnologyBlock, FormBlock, ProjectsBlock } from '../components/blocks'

export default function Page({ site, content, frontmatter }) {
  return (
    <Layout site={site} pageTitle={frontmatter.tab_title}>
      <div>
        <h1>{frontmatter.page_title}</h1>

        {content ? (
          <section>
            <ReactMarkdown escapeHtml={false} source={content} />
          </section>
        ) : null}

        {frontmatter.blocks.map((block, index) => {
          switch (block.template) {
            case 'content-block':
              return <ContentBlock key={index} data={block} />
            case 'technology-block':
              return <TechnologyBlock key={index} data={block} />
            case 'form-block':
              return <FormBlock key={index} data={block} />
            case 'projects-block':
              return <ProjectsBlock key={index} data={block} />
          }
        })}
      </div>
    </Layout>
  )
}

export function getStaticProps({ params: { slug } }) {
  const site = getSiteSettings()
  const data = getPageBySlug(slug.join('/'))

  return { props: { site: site.frontmatter, ...data } }
}

export async function getStaticPaths() {
  const paths = await getAllPagePaths()
  const formattedPaths = paths.map(path => {
    return { params: { slug: path } }
  })
  
  return { paths: formattedPaths, fallback: false }
}
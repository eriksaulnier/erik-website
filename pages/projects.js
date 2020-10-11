import ReactMarkdown from 'react-markdown/with-html'
import { Layout } from '../components/layout'
import ProjectList from '../components/project-list'
import { getSiteSettings, getPageBySlug, getAllProjects } from '../lib/api'

export default function Projects({ site, content, frontmatter, projects }) {
  return (
    <Layout site={site} pageTitle={frontmatter.tab_title.trim()}>
      <div className="container mx-auto">
        <h1>{frontmatter.page_title.trim()}</h1>

        {content ? (
          <section>
            <ReactMarkdown escapeHtml={false} source={content} />
          </section>
        ) : null}
        
        <ProjectList projects={projects} />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const site = getSiteSettings()
  const data = getPageBySlug('projects')
  const projects = await getAllProjects()

  return { props: { site: site.frontmatter, ...data, projects } }
}
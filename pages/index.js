import { getSiteSettings } from '../lib/api'
import { Layout } from '../components/layout'
import Splash from '../components/splash';

export default function Home({ site }) {
  return (
    <Layout site={site}>
      <Splash />
    </Layout>
  )
}

export async function getStaticProps() {
  const site = getSiteSettings()

  return { props: { site: site.frontmatter } }
}
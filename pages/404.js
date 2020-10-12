import { getSiteSettings } from '../lib/api'
import { Layout } from '../components/layout'

export default function Custom404({ site }) {
  return (
    <Layout site={site} pageTitle="404">
      <h1 style={{ textAlign: 'center', marginTop: '10%' }}>Page Not Found</h1>
    </Layout>
  )
}

export function getStaticProps() {
  const site = getSiteSettings()

  return { props: { site } }
}
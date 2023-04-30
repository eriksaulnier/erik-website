import { client } from '@/tina/client';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

async function generateSiteMap() {
  const { data: { pagesConnection } } = await client.queries.pagesConnection({
    filter: {
      blocks: {
        draft: { eq: false }
      }
    }
  });
  const { data: { postsConnection } } = await client.queries.postsConnection({
    filter: {
      draft: { eq: false }
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
  </url>
  ${pagesConnection?.edges?.map(({ node }) => (`<url>
    <loc>${BASE_URL}/${node._sys.breadcrumbs.join('/')}</loc>
  </url>`)).join('')}
  <url>
    <loc>${BASE_URL}/projects</loc>
  </url>
  ${postsConnection?.edges?.map(({ node }) => (`<url>
    <loc>${BASE_URL}/${node._sys.breadcrumbs.join('/')}</loc>
  </url>`)).join('')}
</urlset>`;
}

const handler = async (_req, res) => {
  const file = await generateSiteMap();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml');
  res.write(file);
  res.end();
};

export default handler;
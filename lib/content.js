import { client } from '@/tina/client';

export async function getPages() {
  const { data } = await client.queries.pagesConnection({
    filter: {
      blocks: {
        draft: { eq: false }
      }
    }
  });

  return data?.pagesConnection?.edges?.map(({ node }) => node);
}
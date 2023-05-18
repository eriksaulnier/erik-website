'use client';

import { notFound } from 'next/navigation';
import { getPages } from '@/lib/content';
import { transformImages } from '@/lib/images';


export default async function Page({ params: { slug }}) {
  const { data, query, variables } = await client.queries.pages({
    relativePath: `${slug}.mdx`,
  });

  if (!!data?.pages?.draft && !preview) {
    return notFound();
  }

  // Transform the images
  if (data?.pages?.blocks) {
    data.pages.blocks = await transformImages(data.pages.blocks);
  }
  
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}

export async function generateStaticParams() {
  return (await getPages() || []).map(({ _sys }) => {
    slug: _sys.breadcrumbs.join('/');
  });
}
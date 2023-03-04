import { motion } from 'framer-motion'
import { client } from '@/tina/client'
import { useTina } from 'tinacms/dist/react';
import {
  ContentBlock,
  TechnologyBlock,
  FormBlock,
  ProjectsBlock,
  PostsBlock
} from '@/components/blocks'
import { getPlaceholderImageURL } from '@/lib/images'

export default function Page(props) {
  const { data: { pages: pageData } } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })
  const slug = props.variables.relativePath.replace('.mdx', '')
  const { heading, blocks } = pageData
  const typenamePrefix = 'PagesBlocksBlocks';

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
        {heading}
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
              [`${typenamePrefix}Content`]: <ContentBlock data={block} />,
              [`${typenamePrefix}Technology`]: <TechnologyBlock data={block} />,
              [`${typenamePrefix}Form`]: <FormBlock data={block} />,
              [`${typenamePrefix}Projects`]: <ProjectsBlock data={block} />,
              [`${typenamePrefix}Posts`]: <PostsBlock data={block} />
            }[block.__typename]
          }
        </motion.div>
      ))}
    </motion.div>
  )
}

export const getStaticProps = async ({ params, preview = false }) => {
  const { data, query, variables } = await client.queries.pages({
    relativePath: `${params.slug.join('/')}.mdx`
  });

  if (data?.pages?.blocks) {
    data.pages.blocks = await Promise.all(data.pages.blocks.map(async (block) => {
      if (block.__typename === 'PagesBlocksBlocksContent') {
        if (block.aside_image?.image) {
          block.aside_image.image = await getPlaceholderImageURL(block.aside_image.image);
        }
      }
      return block;
    }))
  }

  console.log('data', data?.pages?.blocks)

  return {
    notFound: !data?.pages?.published && !preview,
    props: {
      preview,
      data,
      query,
      variables
    },
  };
};

export const getStaticPaths = async () => {
  const { data } = await client.queries.pagesConnection({
    filter: {
      blocks: {
        published: { eq: true }
      }
    }
  });
  const paths = data.pagesConnection.edges.map((x) => {
    return {
      params: {
        slug: x.node._sys.breadcrumbs
      }
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
};
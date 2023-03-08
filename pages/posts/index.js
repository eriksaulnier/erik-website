import { motion } from 'framer-motion'
import { useTina } from 'tinacms/dist/react';
import { client } from '@/tina/client'
import { PostsBlock } from '@/components/blocks'

export default function PostsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })
  const posts = data.postsConnection.edges;

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
        Posts
      </motion.h1>
      
      <motion.div
        variants={{
          initial: { y: 10, opacity: 0 },
          enter: { y: 0, opacity: 1 },
          exit: { y: 5, opacity: 0 },
        }}
      >
        <PostsBlock data={{ posts }} />
      </motion.div>
    </motion.div>
  )
}

export const getStaticProps = async ({ preview = false }) => {
  let filter = {
    draft: { eq: false }
  };

  // If we're in preview mode, we want to show everything
  if (preview) {
    filter = {};
  };

  const { data, query, variables } = await client.queries.postsConnection({
    filter,
    sort: 'publish_date',
    // return the results in reverse order
    last: -1,
  });

  return {
    props: {
      data: data || null,
      query: query || null,
      variables: variables || null,
    },
  };
};

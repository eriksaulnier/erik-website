import { motion } from 'framer-motion';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { client } from '@/tina/client';
import Link from 'next/link';

export default function Post(props) {
  const { data: { posts: postData } } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const contentAnimations = {
    initial: { y: 10, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    exit: { y: 5, opacity: 0 },
  };

  const date = new Date(postData.publish_date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h1
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 }
        }}
      >
        {postData.title}
      </motion.h1>
      <motion.p
        variants={contentAnimations}>
        <b>Posted {formattedDate}</b>
      </motion.p>
      
      
      {postData.body && <motion.div variants={contentAnimations}>
        <TinaMarkdown
          content={postData.body}
          components={{
            a: ({ url, children }) => {
              return (
                <Link href={url}>
                  {children}
                </Link>
              );
            },
          }}
        />
      </motion.div>}
    </motion.div>
  );
}

export const getStaticProps = async ({ params, preview = false }) => {
  const { data, query, variables } = await client.queries.posts({
    relativePath: `${params.slug.join('/')}.mdx`
  });

  return {
    notFound: !!data?.posts?.draft && !preview,
    props: {
      preview,
      data,
      query,
      variables
    },
  };
};

export const getStaticPaths = async () => {
  const { data } = await client.queries.postsConnection({
    filter: {
      draft: { eq: false }
    }
  });

  const paths = data?.postsConnection?.edges?.map(({ node }) => ({
    params: {
      slug: node._sys.breadcrumbs
    }
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
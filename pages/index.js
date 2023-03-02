import { motion } from 'framer-motion'
import { client } from '@/tina/client'
import { useTina } from 'tinacms/dist/react';
import Splash from '@/components/splash'

export default function Home(props) {
  const { data: { pages: pageData } } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <motion.div
      initial="initial" animate="enter" exit="exit"
      variants={{
        initial: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }}
    >
      <Splash data={pageData} />
    </motion.div>
  )
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.pages({
    relativePath: 'home.mdx',
  });

  return {
    props: {
      data,
      query,
      variables
    },
  };
};
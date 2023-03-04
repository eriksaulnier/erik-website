import { motion } from 'framer-motion'
import { getFeaturedProjects } from '@/lib/content'
import { useTina } from 'tinacms/dist/react';
import { ProjectsBlock } from '@/components/blocks'
import { getPlaceholderImageURL } from '@/lib/images'

export default function ProjectsPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })
  const projects = data.projectsConnection.edges;

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
        Projects
      </motion.h1>
      
      <motion.div
        variants={{
          initial: { y: 10, opacity: 0 },
          enter: { y: 0, opacity: 1 },
          exit: { y: 5, opacity: 0 },
        }}
      >
        <ProjectsBlock data={{ projects }} />
      </motion.div>
    </motion.div>
  )
}

export const getStaticProps = async ({ preview = false }) => {
  const { data, query, variables } = await getFeaturedProjects({
    preview
  });

  if (data?.projectsConnection?.edges) {
    data.projectsConnection.edges = await Promise.all(data.projectsConnection.edges.map(async (edge) => {
      edge.node.image = await getPlaceholderImageURL(edge.node.image);
      return edge;
    }))
    console.log('data', data.projectsConnection.edges[0].node.image)
  }

  return {
    props: {
      data,
      query,
      variables
    },
  };
};

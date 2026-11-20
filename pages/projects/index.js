import { motion } from 'framer-motion';
import { listProjects } from '@/lib/content.mjs';
import { resolveImages } from '@/lib/images.mjs';
import { ProjectsBlock } from '@/components/blocks';

export default function ProjectsPage({ projects }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{ enter: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.h1
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 },
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
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      projects: await Promise.all(
        (await listProjects({ featuredOnly: true })).map((project) =>
          resolveImages(project, `projects/${project.slug}`),
        ),
      ),
    },
  };
};

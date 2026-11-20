import { motion } from 'framer-motion';
import { getGlobal, getPage, listPageSlugs } from '@/lib/content.mjs';
import { resolveImages } from '@/lib/images.mjs';
import { blockComponents } from '@/components/blocks';

export default function Page({ page, slug }) {
  const { heading, blocks } = page;

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
        {heading}
      </motion.h1>

      {blocks?.map((block, index) => {
        const BlockComponent = blockComponents[block.discriminant];
        return (
          <motion.div
            key={`${slug}-${index}`}
            variants={{
              initial: { y: 10, opacity: 0 },
              enter: { y: 0, opacity: 1 },
              exit: { y: 5, opacity: 0 },
            }}
          >
            <BlockComponent data={block.value} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export const getStaticProps = async ({ params }) => {
  const slug = params.slug.join('/');
  const page = await getPage(slug);
  if (!page) throw new Error(`Page not found: ${slug}`);

  return {
    props: {
      page: await resolveImages(page, `pages/${slug}`),
      slug,
      site: await getGlobal(),
    },
  };
};

export const getStaticPaths = async () => {
  const slugs = await listPageSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug: slug.split('/') } })),
    fallback: false,
  };
};

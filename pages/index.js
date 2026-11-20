import { motion } from 'framer-motion';
import { getHome } from '@/lib/content.mjs';
import Splash from '@/components/splash';

export default function Home({ home }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        enter: { opacity: 1 },
        exit: { opacity: 0 },
      }}
    >
      <Splash data={home} />
    </motion.div>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      home: await getHome(),
    },
  };
};

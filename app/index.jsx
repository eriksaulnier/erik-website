import { motion } from 'framer-motion';
import { useTina } from 'tinacms/dist/react';
import { client } from '@/tina/client';
import Splash from '@/components/splash';

export default async function Page() {
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
  );
}
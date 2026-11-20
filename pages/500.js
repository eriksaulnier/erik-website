import { getGlobal } from '@/lib/content.mjs';

export default function ServerError() {
  return (
    <h1 style={{ textAlign: 'center', marginTop: '1em' }}>Server Error</h1>
  );
}

export const getStaticProps = async () => {
  return { props: { site: await getGlobal() } };
};

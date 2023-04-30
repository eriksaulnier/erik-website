const BASE_URL = process.env.NEXT_PUBLIC_URL;

async function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`;
}

const handler = async (_req, res) => {
  const file = await generateRobots();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.write(file);
  res.end();
};

export default handler;
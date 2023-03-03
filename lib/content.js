
import { client } from '@/tina/client'

export const getPages = async ({ preview }) => {
  // Only return published pages if not previewing through Tina
  let filter = {
    blocks: {
      published: { eq: true }
    }
  };
  if (preview) {
    filter = {};
  }
  return client.queries.pagesConnection({
    sort: 'publish_date',
    last: -1,
    filter,
  });
};

export const getProjects = async ({ preview }) => {
  // Only return published pages if not previewing through Tina
  let filter = {
    published: { eq: true }
  };
  if (preview) {
    filter = {};
  }
  return client.queries.projectsConnection({
    sort: 'publish_date',
    last: -1,
    filter,
  });
};

export const getFeaturedProjects = async ({ preview }) => {
  // Only return published pages if not previewing through Tina
  let filter = {
    published: { eq: true },
    featured: { eq: true }
  };
  if (preview) {
    filter = {};
  }
  return client.queries.projectsConnection({
    sort: 'publish_date',
    last: -1,
    filter,
  });
};


export const getPosts = async ({ preview }) => {
  // Only return published posts if not previewing through Tina
  let filter = {
    published: { eq: true }
  };
  if (preview) {
    filter = {};
  }
  return client.queries.postsConnection({
    sort: 'publish_date',
    last: -1,
    filter,
  });
};
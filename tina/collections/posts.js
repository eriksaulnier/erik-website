import imageField from '../fields/image';

const posts = {
  label: 'Posts',
  name: 'posts',
  path: 'posts',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.breadcrumbs.join('/')}`;
    },
    filename: {
      slugify: (values) => (values?.title?.toLowerCase().replace(/ /g, '-')),
    },
    defaultItem: () => ({
      draft: true,
      publish_date: new Date().toString(),
    }),
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      isTitle: true,
      required: true
    },
    {
      name: 'draft',
      label: 'Draft',
      type: 'boolean',
    },
    {
      name: 'publish_date',
      label: 'Publish Date',
      type: 'datetime',
    },

    {
      name: 'body',
      label: 'Blog Post Body',
      type: 'rich-text',
      isBody: true,
      // TODO: need to disable default image upload
      templates: [imageField]
    },
  ],
};
export default posts;
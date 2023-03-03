const posts = {
  label: 'Posts',
  name: 'posts',
  path: 'content/posts',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.breadcrumbs.join('/')}`;
    },
    filename: {
      slugify: (values) => {
        const title = values?.title?.toLowerCase().replace(/ /g, '-');
        const publish_date = new Date(values?.publish_date);
        const year = publish_date.getFullYear();
        return `${year}/${title}`
      },
    },
    defaultItem: () => {
      return {
        publish_date: new Date().toString(),
      }
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true
    },
    {
      name: 'published',
      label: 'Published',
      type: 'boolean',
    },
    {
      name: 'publish_date',
      label: 'Publish Date',
      type: 'datetime',
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'string',
      list: true,
      ui: {
        component: 'tags'
      },
      fields: [
        {
          type: 'string',
          label: 'Tag',
          name: 'tag',
          required: true
        }
      ]
    },
    {
      type: 'rich-text',
      label: 'Blog Post Body',
      name: 'body',
      isBody: true
    },
  ],
};
export default posts;
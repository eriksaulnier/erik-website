const projects = {
  label: 'Projects',
  name: 'projects',
  path: 'projects',
  format: 'mdx',
  ui: {
    // TODO: Some day projects could have dedicated pages
    // router: ({ document }) => {
    //   return `/projects/${document._sys.breadcrumbs.join('/')}`;
    // },
    filename: {
      slugify: (values) => {
        const name = values?.name?.toLowerCase().replace(/ /g, '-');
        const publish_date = new Date(values?.publish_date);
        const year = publish_date.getFullYear();
        return `${year}/${name}`
      }
    },
    defaultItem: () => {
      return {
        publish_date: new Date().toString(),
      }
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Project Name',
      type: 'string',
      isTitle: true,
      required: true
    },
    {
      name: 'published',
      label: 'Published',
      type: 'boolean',
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'boolean'
    },
    {
      name: 'publish_date',
      label: 'Publish Date',
      type: 'datetime',
      required: true,
      dateFormat: 'MMMM, YYYY',
    },
    {
      name: 'description',
      label: 'Project Description',
      type: 'string',
      ui: {
        component: 'textarea'
      }
    },
    {
      name: 'technologies',
      label: 'Technologies',
      type: 'object',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item.label ? item.label : '(new item)',
        }),
      },
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'string',
        },
        {
          name: 'icon',
          label: 'React Icon Name',
          type: 'string',
          description: 'Find all icon names here: https://react-icons.github.io/react-icons/',
        },
      ],
    },
    {
      name: 'links',
      label: 'Links',
      type: 'object',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item.title ? item.title : '(new item)',
        }),
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'string',
        },
        {
          name: 'href',
          label: 'URL',
          type: 'string',
        },
        {
          name: 'icon',
          label: 'React Icon Name',
          type: 'string',
          description: 'Find all icon names here: https://react-icons.github.io/react-icons/',
        },
      ],
    },
    {
      name: 'image',
      label: 'Project Image',
      type: 'image',
    },
    // TODO: Some day projects could have dedicated pages
    // {
    //   name: "body",
    //   label: "Project Post Body",
    //   type: "rich-text",
    //   isBody: true
    // },
  ],
};
export default projects;
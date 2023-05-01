import imageField from '../fields/image';

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
      slugify: (values) => (values?.name?.toLowerCase().replace(/ /g, '-')),
    },
    defaultItem: () => {
      return {
        draft: true,
        publish_date: new Date().toString(),
      };
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
      name: 'draft',
      label: 'Draft',
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
      ...imageField,
      name: 'thumbnail',
      label: 'Thumbnail',
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
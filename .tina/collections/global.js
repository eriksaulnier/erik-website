const global = {
  label: 'Global',
  name: 'global',
  path: 'global',
  format: 'json',
  ui: {
    global: true,
    defaultItem: () => ({
      filename: 'app.config'
    }),
    filename: {
      readonly: true
    },
    allowedActions: {
      create: false,
      delete: false,
    }
  },
  fields: [
    {
      name: 'title',
      label: 'Site Title',
      type: 'string',
      required: true
    },
    {
      name: 'description',
      label: 'Site Description',
      type: 'string',
      ui: {
        component: 'textarea'
      }
    },
    {
      name: 'thumbnail',
      label: 'Site Thumbnail',
      type: 'image',
    },
    {
      name: 'header',
      label: 'Header',
      type: 'object',
      fields: [
        {
          name: 'navigation',
          label: 'Navigation',
          type: 'object',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item.title || '(new item)',
            }),
          },
          fields: [
            {
              name: 'title',
              label: 'Page Title',
              type: 'string',
              description: 'This is how the page will be displayed in the navigation',
              required: true
            },
            {
              name: 'path',
              label: 'Page Path',
              type: 'string',
              description: 'This is the path to the page, e.g. /about',
              required: true
            },
          ]
        },
        {
          name: 'social',
          label: 'Social Links',
          type: 'object',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item.title || '(new item)',
            }),
          },
          fields: [
            {
              name: 'title',
              label: 'Link Title',
              type: 'string',
              description: 'To be used as the link text if no icon is provided',
              required: true
            },
            {
              name: 'icon',
              label: 'React Icon Name',
              type: 'string',
              description: 'Find all icon names here: https://react-icons.github.io/react-icons/',
            },
            {
              name: 'link',
              label: 'Link',
              type: 'string',
              required: true
            },
          ]
        }
      ],
    },
    {
      name: 'footer',
      label: 'Footer',
      type: 'object',
      fields: [
        {
          name: 'copyright',
          label: 'Copyright',
          type: 'object',
          fields: [
            {
              name: 'year',
              label: 'Year',
              type: 'string',
              required: true,
              ui: {
                validate: (value, data) => {
                  if (isNaN(value)) {
                    return 'Year must be a number'
                  }
                  if (value.length !== 4) {
                    return 'Year must be 4 digits'
                  }
                  
                }
              }
            },
            {
              name: 'text',
              label: 'Text',
              type: 'string',
              required: true
            },
          ]
        }
      ]
    }
  ]
};
export default global;
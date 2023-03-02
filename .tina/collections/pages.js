const pages = {
  label: 'Pages',
  name: 'pages',
  path: 'pages',
  format: 'mdx',
  templates: [
    {
      name: 'blocks',
      label: 'Blocks Page',
      ui: {
        filename: {
          slugify: (values) => (values?.title?.toLowerCase().replace(/ /g, '-')),
        },
      },
      fields: [
        {
          name: 'title',
          label: 'Page Title',
          type: 'string',
          isTitle: true,
          required: true
        },
        {
          name: 'heading',
          label: 'Page Heading',
          type: 'string',
          required: true
        },
        {
          name: 'seo_description',
          label: 'SEO Description',
          type: 'string',
        },
        {
          name: 'published',
          label: 'Published',
          type: 'boolean',
        },
        {
          name: 'blocks',
          label: 'Sections',
          type: 'object',
          list: true,
          templates: [
            {
              name: 'content',
              label: 'Content Section',
              ui: {
                itemProps: (item) => ({
                  label: item.title ? `Content: ${item.title}` : 'Content Section',
                }),
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'string',
                },
                {
                  name: 'body',
                  label: 'Body',
                  type: 'rich-text'
                },
                {
                  name: 'aside_image',
                  label: 'Aside Image',
                  type: 'object',
                  fields: [
                    {
                      name: 'image',
                      label: 'Image',
                      type: 'image',
                    },
                    {
                      name: 'alt',
                      label: 'Alt Text',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
            {
              name: 'form',
              label: 'Form Section',
              ui: {
                itemProps: (item) => ({
                  label: item.title ? `Form: ${item.title}` : 'Form Section',
                }),
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'string',
                },
                {
                  name: 'name',
                  label: 'Form Name',
                  type: 'string',
                },
                {
                  name: 'fields',
                  label: 'Fields',
                  type: 'object',
                  list: true,
                  templates: [
                    {
                      name: 'input',
                      label: 'Input Field',
                      ui: {
                        itemProps: (item) => ({
                          label: item.label ? `Input: ${item.label}` : 'Input',
                        }),
                      },
                      fields: [
                        {
                          name: 'label',
                          label: 'Label',
                          type: 'string',
                          description: 'To be displayed above the field',
                        },
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'string',
                          description: 'HTML \'name\' attribute. Keep this to letters and underscores only (no spaces)',
                        },
                        {
                          name: 'description',
                          label: 'Description',
                          type: 'string',
                          description: 'To be displayed below the field',
                        },
                        {
                          name: 'required',
                          label: 'Required',
                          type: 'boolean',
                        },
                        {
                          name: 'type',
                          label: 'Type',
                          type: 'string',
                          options: [
                            'text',
                            'email',
                            'tel',
                            'date',
                            'time',
                            'url',
                            'number',
                            'range',
                            'color',
                            'date',
                            'datetime-local',
                          ]
                        },
                        {
                          name: 'placeholder',
                          label: 'Placeholder',
                          type: 'string'
                        },
                        {
                          name: 'width',
                          label: 'Width',
                          type: 'number',
                          ui: {
                            validate: (value) => {
                              if (value < 1 || value > 100) {
                                return 'Width must be between 1 and 100';
                              }
                            },
                          },
                        },
                      ]
                    },
                    {
                      name: 'textarea',
                      label: 'Textarea Field',
                      ui: {
                        itemProps: (item) => ({
                          label: item.label ? `Textarea: ${item.label}` : 'Textarea',
                        }),
                      },
                      fields: [
                        {
                          name: 'label',
                          label: 'Label',
                          type: 'string',
                          description: 'To be displayed above the field',
                        },
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'string',
                          description: 'HTML \'name\' attribute. Keep this to letters and underscores only (no spaces)',
                        },
                        {
                          name: 'description',
                          label: 'Description',
                          type: 'string',
                          description: 'To be displayed below the field',
                        },
                        {
                          name: 'required',
                          label: 'Required',
                          type: 'boolean',
                        },
                        {
                          name: 'placeholder',
                          label: 'Placeholder',
                          type: 'string'
                        },
                        {
                          name: 'rows',
                          label: 'Rows',
                          type: 'number'
                        },
                        {
                          name: 'width',
                          label: 'Width',
                          type: 'number',
                          ui: {
                            validate: (value) => {
                              if (value < 1 || value > 100) {
                                return 'Width must be between 1 and 100';
                              }
                            },
                          },
                        },
                      ]
                    },
                    {
                      name: 'select',
                      label: 'Select Field',
                      ui: {
                        itemProps: (item) => ({
                          label: item.label ? `Select: ${item.label}` : 'Select',
                        }),
                      },
                      fields: [
                        {
                          name: 'label',
                          label: 'Label',
                          type: 'string',
                          description: 'To be displayed above the field',
                        },
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'string',
                          description: 'HTML \'name\' attribute. Keep this to letters and underscores only (no spaces)',
                        },
                        {
                          name: 'description',
                          label: 'Description',
                          type: 'string',
                          description: 'To be displayed below the field',
                        },
                        {
                          name: 'required',
                          label: 'Required',
                          type: 'boolean',
                        },
                        {
                          name: 'placeholder',
                          label: 'Placeholder',
                          type: 'string'
                        },
                        {
                          name: 'options',
                          label: 'Options',
                          type: 'object',
                          list: true,
                          fields: [
                            {
                              name: 'label',
                              label: 'Label',
                              type: 'string',
                            },
                            {
                              name: 'value',
                              label: 'Value',
                              type: 'string',
                            },
                          ],
                        },
                        {
                          name: 'width',
                          label: 'Width',
                          type: 'number',
                          ui: {
                            validate: (value) => {
                              if (value < 1 || value > 100) {
                                return 'Width must be between 1 and 100';
                              }
                            },
                          },
                        },
                      ]
                    },
                    {
                      name: 'checkbox',
                      label: 'Checkbox Field',
                      ui: {
                        itemProps: (item) => ({
                          label: item.label ? `Checkbox: ${item.label}` : 'Checkbox',
                        }),
                      },
                      fields: [
                        {
                          name: 'label',
                          label: 'Label',
                          type: 'string',
                          description: 'To be displayed above the field',
                        },
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'string',
                          description: 'HTML \'name\' attribute. Keep this to letters and underscores only (no spaces)',
                        },
                        {
                          name: 'description',
                          label: 'Description',
                          type: 'string',
                          description: 'To be displayed below the field',
                        },
                        {
                          name: 'required',
                          label: 'Required',
                          type: 'boolean',
                        },
                        {
                          name: 'placeholder',
                          label: 'Placeholder',
                          type: 'string'
                        },
                        {
                          name: 'options',
                          label: 'Options',
                          type: 'object',
                          list: true,
                          fields: [
                            {
                              name: 'label',
                              label: 'Label',
                              type: 'string',
                            },
                            {
                              name: 'value',
                              label: 'Value',
                              type: 'string',
                            },
                          ],
                        },
                        {
                          name: 'width',
                          label: 'Width',
                          type: 'number',
                          ui: {
                            validate: (value) => {
                              if (value < 1 || value > 100) {
                                return 'Width must be between 1 and 100';
                              }
                            },
                          },
                        },
                      ]
                    },
                    {
                      name: 'radio',
                      label: 'Radio Field',
                      ui: {
                        itemProps: (item) => ({
                          label: item.label ? `Radio: ${item.label}` : 'Radio',
                        }),
                      },
                      fields: [
                        {
                          name: 'label',
                          label: 'Label',
                          type: 'string',
                          description: 'To be displayed above the field',
                        },
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'string',
                          description: 'HTML \'name\' attribute. Keep this to letters and underscores only (no spaces)',
                        },
                        {
                          name: 'description',
                          label: 'Description',
                          type: 'string',
                          description: 'To be displayed below the field',
                        },
                        {
                          name: 'required',
                          label: 'Required',
                          type: 'boolean',
                        },
                        {
                          name: 'placeholder',
                          label: 'Placeholder',
                          type: 'string'
                        },
                        {
                          name: 'options',
                          label: 'Options',
                          type: 'object',
                          list: true,
                          fields: [
                            {
                              name: 'label',
                              label: 'Label',
                              type: 'string',
                            },
                            {
                              name: 'value',
                              label: 'Value',
                              type: 'string',
                            },
                          ],
                        },
                        {
                          name: 'width',
                          label: 'Width',
                          type: 'number',
                          ui: {
                            validate: (value) => {
                              if (value < 1 || value > 100) {
                                return 'Width must be between 1 and 100';
                              }
                            },
                          },
                        },
                      ]
                    }
                  ]
                },
                {
                  name: 'submit_label',
                  label: 'Submit Label',
                  type: 'string',
                },
              ],
            },
            {
              name: 'technology',
              label: 'Technology Section',
              ui: {
                itemProps: (item) => ({
                  label: item.title ? `Technology: ${item.title}` : 'Technology Section',
                }),
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'string',
                },
                {
                  name: 'categories',
                  label: 'Categories',
                  type: 'object',
                  list: true,
                  ui: {
                    itemProps: (item) => ({
                      label: item.label || '(new item)'
                    }),
                  },
                  fields: [
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'string',
                    },
                    {
                      name: 'technologies',
                      label: 'Technologies',
                      type: 'object',
                      list: true,
                      ui: {
                        itemProps: (item) => ({
                          label: item.label || '(new item)'
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
                  ],
                },
              ],
            },
            {
              name: 'projects',
              label: 'Projects Section',
              ui: {
                itemProps: (item) => ({
                  label: item.title ? `Projects: ${item.title}` : 'Projects Section',
                }),
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'string',
    
                },
                {
                  name: 'projects',
                  label: 'Projects',
                  type: 'object',
                  list: true,
                  ui: {
                    itemProps: (item) => ({
                      label: item.project || '(new item)',
                    }),
                  },
                  fields: [
                    {
                      type: 'reference',
                      label: 'Project',
                      name: 'project',
                      collections: ['projects']
                    },
                  ]
                }
              ],
            },
            {
              name: 'posts',
              label: 'Posts Section',
              ui: {
                itemProps: (item) => ({
                  label: item.title ? `Posts: ${item.title}` : 'Posts Section',
                }),
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'string',
                },
                {
                  name: 'posts',
                  label: 'Posts',
                  type: 'object',
                  list: true,
                  fields: [
                    {
                      type: 'reference',
                      label: 'Post',
                      name: 'post',
                      collections: ['posts'],
                      required: true
                    },
                  ]
                }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'splash',
      label: 'Splash Page',
      ui: {
        defaultItem: () => ({
          filename: 'home.mdx',
          title: 'Home'
        }),
        filename: {
          readonly: true
        },
        router: () => {
          return '/';
        },
        allowedActions: {
          create: false,
          delete: false,
        }
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'string',
          isTitle: true,
          required: true,
          description: 'This is the title of the page for the admin interface. It is not visible anywhere else.'
        },
        {
          name: 'heading',
          label: 'Heading',
          type: 'string',
          required: true
        },
        {
          name: 'subheading',
          label: 'Subheading',
          type: 'string',
          required: true,
          description: 'Put two vertical bars, `||`, where the typed words should go'
        },
        {
          name: 'typed_words',
          label: 'Typed Words',
          type: 'string',
          list: true,
          required: true,
        },
        {
          name: 'shuffle_words',
          label: 'Shuffle Words',
          type: 'boolean',
        }
      ]
    }
  ]
};
export default pages;
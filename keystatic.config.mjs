import { collection, config, fields, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const imageSource = (area) =>
  fields.image({
    label: 'Image',
    directory: `public/images/${area}`,
    publicPath: `/images/${area}/`,
  });

const image = (label, area) =>
  fields.object(
    {
      src: imageSource(area),
      alt: fields.text({ label: 'Alt text' }),
    },
    { label },
  );

const technologies = fields.array(
  fields.object({
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    icon: fields.text({
      label: 'Icon',
      description: 'react-icons name, for example SiReact',
    }),
  }),
  { label: 'Technologies', itemLabel: (props) => props.fields.label.value },
);

export default config({
  storage: { kind: 'local' },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'content/home',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Title' }),
        heading: fields.text({ label: 'Heading' }),
        subheading: fields.text({
          label: 'Subheading',
          description: '|| marks where the typed words go',
        }),
        typed_words: fields.array(fields.text({ label: 'Word' }), {
          label: 'Typed words',
          itemLabel: (props) => props.value,
        }),
        shuffle_words: fields.checkbox({ label: 'Shuffle words' }),
      },
    }),
    global: singleton({
      label: 'Global',
      path: 'content/global',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Site title' }),
        description: fields.text({ label: 'Description', multiline: true }),
        thumbnail: image('Social thumbnail', 'site'),
        header: fields.object(
          {
            navigation: fields.array(
              fields.object({
                title: fields.text({ label: 'Title' }),
                path: fields.text({ label: 'Path' }),
              }),
              {
                label: 'Navigation',
                itemLabel: (props) => props.fields.title.value,
              },
            ),
            social: fields.array(
              fields.object({
                title: fields.text({ label: 'Title' }),
                icon: fields.text({ label: 'Icon' }),
                link: fields.url({ label: 'Link' }),
              }),
              {
                label: 'Social links',
                itemLabel: (props) => props.fields.title.value,
              },
            ),
          },
          { label: 'Header' },
        ),
        footer: fields.object(
          {
            copyright: fields.object(
              {
                year: fields.text({ label: 'Year' }),
                text: fields.text({ label: 'Text' }),
              },
              { label: 'Copyright' },
            ),
          },
          { label: 'Footer' },
        ),
      },
    }),
  },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'content/pages/**',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        heading: fields.text({ label: 'Heading' }),
        seo_description: fields.text({
          label: 'SEO description',
          multiline: true,
        }),
        draft: fields.checkbox({ label: 'Draft' }),
        blocks: fields.blocks(
          {
            content: {
              label: 'Content',
              itemLabel: (props) => props.fields.title.value || 'Content',
              schema: fields.object({
                title: fields.text({ label: 'Title' }),
                body: fields.markdoc.inline({
                  label: 'Body',
                  options: { image: false },
                  components: {
                    image: block({
                      label: 'Image',
                      schema: {
                        src: imageSource('pages'),
                        alt: fields.text({
                          label: 'Alt text',
                          validation: { isRequired: true },
                        }),
                      },
                    }),
                  },
                }),
                aside_image: image('Aside image', 'pages'),
              }),
            },
            technology: {
              label: 'Technology',
              itemLabel: (props) => props.fields.title.value || 'Technology',
              schema: fields.object({
                title: fields.text({ label: 'Title' }),
                categories: fields.array(
                  fields.object({
                    label: fields.text({ label: 'Label' }),
                    technologies,
                  }),
                  {
                    label: 'Categories',
                    itemLabel: (props) => props.fields.label.value,
                  },
                ),
              }),
            },
          },
          { label: 'Blocks' },
        ),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'content/projects/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        draft: fields.checkbox({ label: 'Draft' }),
        featured: fields.checkbox({ label: 'Featured' }),
        publish_date: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        technologies,
        links: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            href: fields.url({ label: 'URL' }),
            icon: fields.text({ label: 'Icon' }),
          }),
          { label: 'Links', itemLabel: (props) => props.fields.title.value },
        ),
        thumbnail: image('Thumbnail', 'projects'),
      },
    }),
  },
});

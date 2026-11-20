// Only the server transform (lib/content.mjs) uses this. It holds no React, so
// plain Node scripts can load it.
export const markdocConfig = {
  nodes: {
    link: {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
    },
  },
  tags: {
    image: {
      render: 'Image',
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
      },
    },
  },
};

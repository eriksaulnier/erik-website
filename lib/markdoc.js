import React from 'react';
import Markdoc from '@markdoc/markdoc';
import Link from 'next/link';
import Image from 'next/image';

// Runs in the browser. It MUST NOT import lib/images.mjs or anything else
// that touches the file system: image tags arrive already resolved.
const components = {
  Link: ({ href, children, ...props }) => (
    <Link href={href} target={href.startsWith('http') ? '_blank' : '_self'} {...props}>
      {children}
    </Link>
  ),
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props) => <Image {...props} style={{ width: '100%', height: 'auto' }} />,
};

export function renderMarkdoc(tree) {
  return Markdoc.renderers.react(tree, React, { components });
}

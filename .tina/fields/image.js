import { encode } from 'blurhash';
import { set } from 'lodash';

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    if (src.indexOf('http') === 0) {
      img.crossOrigin = 'anonymous';
    }
  });
};

const getImageData = (img) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
};

const imageField = {
  name: 'image',
  label: 'Image',
  type: 'object',
  fields: [
    {
      name: 'src',
      label: 'Image',
      type: 'image',
      ui: {
        // This function is responsible for filling in the image metadata
        validate: async (value, allValues, meta, field) => {
          if (meta.modified) {
            const name = meta.name.substring(0, meta.name.lastIndexOf('.src'));
            const propertyPrefix = name ? `${name}.` : '';
            
            if (value) {
              const image = await loadImage(value);
              const imageData = getImageData(image);

              // Calculate the blurhash placeholder for the image
              const width = Math.round(imageData.width / 200) % 9;
              const height = Math.round(imageData.height / 200) % 9;
              const blurhash = encode(imageData.data, imageData.width, imageData.height, width, height);

              set(allValues, `${propertyPrefix}width`, imageData.width);
              set(allValues, `${propertyPrefix}height`, imageData.height);
              set(allValues, `${propertyPrefix}blurhash`, blurhash);
            } else {
              set(allValues, `${propertyPrefix}width`, undefined);
              set(allValues, `${propertyPrefix}height`, undefined);
              set(allValues, `${propertyPrefix}blurhash`, undefined);
            }
          }
        }
      }
    },
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'string',
      description: 'Alternative text describing the image for screen readers and SEO.',
    },
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      description: 'Title attribute for the image. Shows on hover.',
    },
    {
      name: 'width',
      type: 'number',
      ui: {
        component: () => null,
      }
    },
    {
      name: 'height',
      type: 'number',
      ui: {
        component: () => null,
      }
    },
    {
      name: 'blurhash',
      type: 'string',
      ui: {
        component: () => null,
      }
    }
  ],
};
export default imageField;
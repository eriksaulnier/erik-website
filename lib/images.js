import blurHashToDataURL from './blurhash'

/**
 * Transforms data to include placeholder image URLs.
 * Supports image fields named `image` and image markdown elements.
 * @param {any} target The data to transform.
 * @returns {Promise<any>} The transformed data.
 */
export async function transformImages(target) {
  if (!target) return target;
  if (Array.isArray(target)) {
    return await Promise.all(target.map(async (item) => {
      return await transformImages(item);
    }));
  }

  if (target.src && target.width && target.height && target.blurhash) {
    const blurDataUrl = blurHashToDataURL(target.blurhash, target.width / 10, target.height / 10);
    return {
      ...target,
      blurDataURL: blurDataUrl,
      placeholder: 'blur'
    };
  }

  let result = {};
  for (const key in target) {
    if (!target.hasOwnProperty(key)) {
      continue;
    }

    const value = target[key];
    if (!value) {
      continue;
    }

    if (typeof value === 'object') {
      result[key] = await transformImages(value);
    } else {
      result[key] = value;
    }
  }
 
  return result;
}
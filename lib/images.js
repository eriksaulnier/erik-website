import { getPlaiceholder } from 'plaiceholder'

export async function getPlaceholderImageURL(imageURL) {
  const { base64, img } = await getPlaiceholder(imageURL, { size: 10 });
  return {
    ...img,
    blurDataURL: base64
  }
}
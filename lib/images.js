export function getPlaceholderImageURL(imageURL) {
  return `/_next/image?url=${encodeURIComponent(imageURL)}&q=1&w=128`
}
/** Reversed base64, so the plain address never appears in the exported HTML. */
export function encodeEmail(address) {
  return btoa([...address].reverse().join(''));
}

export function decodeEmail(encoded) {
  return [...atob(encoded)].reverse().join('');
}

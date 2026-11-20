const ADMIN = 'http://127.0.0.1:4321/keystatic';

/** Maps a site path to the local Keystatic screen that edits it. */
export function adminUrl(asPath) {
  const path = asPath.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  if (path === '') return `${ADMIN}/singleton/home`;
  if (path === 'projects') return `${ADMIN}/collection/projects`;
  return `${ADMIN}/collection/pages/item/${encodeURIComponent(path)}`;
}

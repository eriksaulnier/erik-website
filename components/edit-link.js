import { useRouter } from 'next/router';
import { adminUrl } from '@/lib/admin-url.mjs';

// Dev only: Keystatic has no on-page editing, so this opens the matching
// entry in the local admin (`mise run dev` starts both).
export default function EditLink() {
  const { asPath } = useRouter();
  return (
    <a
      href={adminUrl(asPath)}
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 1000,
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        background: '#1f6feb',
        color: '#fff',
        fontSize: '0.875rem',
        textDecoration: 'none',
      }}
    >
      Edit in Keystatic
    </a>
  );
}

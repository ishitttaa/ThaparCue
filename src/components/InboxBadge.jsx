import { useAuth } from '../context/AuthContext';
import { useInboxBadgeCount } from '../hooks/useUnread';
import { useInboxRealtime } from '../hooks/useInboxRealtime';

export default function InboxBadge() {
  const { user } = useAuth();
  const { total } = useInboxBadgeCount();
  useInboxRealtime(user?.id);

  if (!total) return null;

  return (
    <span
      aria-label={`${total} new in your inbox`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        marginLeft: 6,
        borderRadius: 9,
        background: 'var(--danger, #dc2626)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {total > 9 ? '9+' : total}
    </span>
  );
}
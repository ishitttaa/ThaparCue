import { Link } from 'react-router-dom'
import './NotificationBell.css'

export default function NotificationBell({ count = 0, to = '/inbox' }) {
  const has = count > 0
  const label = count > 9 ? '9+' : count

  return (
    <Link
      to={to}
      className={`nbell ${has ? 'nbell-ring' : ''}`}
      aria-label={has ? `${count} unread notifications` : 'Notifications'}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
      {has && <span className="nbell-badge" key={count}>{label}</span>}
    </Link>
  )
}
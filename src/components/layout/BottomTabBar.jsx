import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInboxBadgeCount } from '../../hooks/useUnread';
import './BottomTabBar.css';

const icons = {
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  explore: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
};

const tabs = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/explore', label: 'Explore', icon: 'explore' },
  { to: '/inbox', label: 'Inbox', icon: 'inbox', badge: true },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export default function BottomTabBar() {
  const { isAuthenticated } = useAuth();
  const { total } = useInboxBadgeCount();
  const { pathname } = useLocation();

  // Hide for logged-out users, and inside a chat (/inbox/:id) so it doesn't cover the message box
  const inChat = /^\/inbox\/.+/.test(pathname);
  if (!isAuthenticated || inChat) return null;

  return (
    <nav className="btab" aria-label="Main navigation">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => `btab-item ${isActive ? 'btab-active' : ''}`}
        >
          <span className="btab-icon">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icons[t.icon]}
            </svg>
            {t.badge && total > 0 && (
              <span className="btab-badge">{total > 9 ? '9+' : total}</span>
            )}
          </span>
          <span className="btab-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
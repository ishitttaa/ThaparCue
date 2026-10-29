import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
  try {
    await logout();
    navigate('/');
    setMenuOpen(false);
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
};

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/explore', label: 'Explore' },
        { to: '/courses', label: 'Courses' },
        { to: '/skills', label: 'Skills' },
        { to: '/inbox', label: 'Inbox' },
      ]
    : [
        { to: '/courses', label: 'Courses' },
        { to: '/skills', label: 'Skills' },
        { to: '/explore', label: 'Browse Seniors' },
      ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          <span className="navbar-logo-text font-display">
            Thapar <span className="text-gradient">SkillLink</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links hide-mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-actions hide-mobile">
          {isAuthenticated ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-avatar-btn">
                <div
                  className="avatar-placeholder avatar-sm"
                  style={{ background: `hsl(230, 70%, 58%)`, fontSize: '0.7rem' }}
                >
                  {(user?.name || user?.email || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="navbar-username">
                  {(user?.name || user?.email || 'User').split(' ')[0]}
                </span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger hide-desktop"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu hide-desktop">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar-mobile-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="navbar-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary w-full"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

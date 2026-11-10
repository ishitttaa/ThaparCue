import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="nf-wrap">
      <div className="nf-card">
        <div className="nf-code" aria-hidden="true">
          4<span className="nf-zero">⚡</span>4
        </div>
        <h1 className="nf-title font-display">Page not found</h1>
        <p className="nf-text">
          This link is either broken or the page no longer exists. No worries,
          let's get you back on track.
        </p>
        <div className="nf-actions">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="btn btn-primary"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}
          </Link>
          <Link to="/explore" className="btn btn-ghost">
            Explore Seniors
          </Link>
        </div>
      </div>
    </div>
  );
}
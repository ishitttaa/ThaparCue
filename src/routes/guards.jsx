import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Loader() {
  return <div className="loading-screen">Loading...</div>;
}

function ProfileError({ onRetry }) {
  return (
    <div className="loading-screen">
      <p>We couldn&apos;t load your profile.</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

// Login hona zaroori. Nahi hai to /login, aur wapas aane ke liye purana URL yaad rakhta hai.
export function RequireAuth() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// Login + profile dono zaroori. Profile nahi bani to /onboarding.
export function RequireProfile() {
  const { profile, profileLoading, profileError, refetchProfile } = useAuth();

  if (profileLoading) return <Loader />;
  if (profileError) return <ProfileError onRetry={refetchProfile} />;
  return profile ? <Outlet /> : <Navigate to="/onboarding" replace />;
}

// Sirf onboarding ke liye: profile pehle se hai to dashboard bhej do.
export function RequireNoProfile() {
  const { profile, profileLoading, profileError, refetchProfile } = useAuth();

  if (profileLoading) return <Loader />;
  if (profileError) return <ProfileError onRetry={refetchProfile} />;
  return profile ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

// Sirf logged-out users ke liye (/login). Logged-in ho to andar bhej do.
export function PublicOnly() {
  const { isAuthenticated, authLoading, profile, profileLoading } = useAuth();
  const location = useLocation();

  if (authLoading || profileLoading) return <Loader />;
  if (isAuthenticated) {
    const from = location.state?.from;
    const target = profile
      ? from
        ? `${from.pathname}${from.search ?? ''}`
        : '/dashboard'
      : '/onboarding';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}

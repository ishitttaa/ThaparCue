import { Navigate, Outlet } from 'react-router-dom';
import { useIsModerator } from '../hooks/useReports';

// Sirf moderators ke liye. Ye UX guard hai; asli rok database (RLS + functions) lagata hai.
// RequireAuth + RequireProfile ke andar hi use karo.
export default function RequireModerator() {
  const { data: moderator, isPending, isError } = useIsModerator();

  if (isPending) return <div className="loading-screen">Loading...</div>;
  if (isError || !moderator) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

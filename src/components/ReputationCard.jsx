import { useAuth } from '../context/AuthContext';
import { useStudent } from '../hooks/useProfiles';
import StudentStats from './StudentStats';

export default function ReputationCard() {
  const { user } = useAuth();
  const { data: me } = useStudent(user?.id);
  if (!me) return null;

  return (
    <div
      className="glass-card profile-section anim-fade-up"
      style={{ marginTop: 'var(--space-6)' }}
    >
      <h2 className="font-display section-title">My reputation</h2>
      <StudentStats student={me} />
      <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
        Based on ratings from students you helped, how often you reply to requests,
        and whether requests match courses you have taken.
      </p>
    </div>
  );
}
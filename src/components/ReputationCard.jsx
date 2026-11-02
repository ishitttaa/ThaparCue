import { useAuth } from '../context/AuthContext';
import { useStudent } from '../hooks/useProfiles';
import StudentStats from './StudentStats';

export default function ReputationCard() {
  const { user } = useAuth();
  const { data: me, isPending, error } = useStudent(user?.id);

  return (
    <div
      className="glass-card profile-section anim-fade-up"
      style={{ marginTop: 'var(--space-6)' }}
    >
      <h2 className="font-display section-title">My reputation</h2>

      {isPending ? (
        <p className="text-muted">Loading...</p>
      ) : error ? (
        <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
          Could not load your reputation: {error.message}
        </p>
      ) : me ? (
        <>
          <StudentStats student={me} />
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
            Based on ratings from your conversations, how often you reply to requests,
            and whether requests match courses you have taken.
          </p>
        </>
      ) : (
        <p className="text-muted">No data yet.</p>
      )}
    </div>
  );
}
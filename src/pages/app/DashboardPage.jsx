import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMyProfile } from '../../hooks/useMyProfile';
import { useRequests } from '../../hooks/useRequests';
import { useStudents } from '../../hooks/useProfiles';
import { COURSES } from '../../data/mockCourses';
import SeniorCard from '../../components/SeniorCard';
import RequestModal from '../../components/RequestModal';

function initialsOf(text = '') {
  return (
    text
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  );
}

function previewOf(rawMessage = '') {
  const topic = rawMessage.match(/^Topic:\s*(.+)$/m)?.[1]?.trim();
  if (topic) return topic;
  return rawMessage.trim().slice(0, 60) || 'Skill-sharing request';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: requests = [] } = useRequests();
  const { data: students = [] } = useStudents();
  const [requestTarget, setRequestTarget] = useState(null);

  const displayName = profile?.name || user?.email || 'User';

  // Counts
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;

  // Recent interactions: latest 3 requests (list pehle se newest-first hai)
  const recent = requests.slice(0, 3);

  // Recommended: apni branch wale pehle, phir senior year, unko chhodkar
  // jinke saath pending/accepted request pehle se hai
  const recommended = useMemo(() => {
    const busyIds = new Set(
      requests
        .filter((r) => ['pending', 'accepted'].includes(r.status))
        .map((r) => (r.from_user === user?.id ? r.to_user : r.from_user))
    );
    return students
      .filter((s) => !busyIds.has(s.id))
      .sort(
        (a, b) =>
          Number(b.branch === profile?.branch) - Number(a.branch === profile?.branch) ||
          (b.currentYear ?? 0) - (a.currentYear ?? 0)
      )
      .slice(0, 3);
  }, [students, requests, profile?.branch, user?.id]);

  // Courses abhi mock data par hain
  const suggestedCourses = COURSES.slice(0, 3);

  return (
    <div className="page-content">
      <div className="container">
        {/* Welcome banner */}
        <div className="dashboard-welcome glass-card anim-fade-up">
          <div className="dashboard-welcome-left">
            <div
              className="avatar-placeholder"
              style={{
                width: 60,
                height: 60,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))',
              }}
            >
              {initialsOf(displayName)}
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: 'var(--text-2xl)' }}>
                Welcome back, {displayName.split(' ')[0]}! 👋
              </h1>
              {profile && (
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>
                  {profile.branch} · Year {profile.year}
                </p>
              )}
            </div>
          </div>
          <div className="dashboard-welcome-stats">
            <div className="stat-block">
              <span className="stat-value">{requests.length}</span>
              <span className="stat-label">Requests</span>
            </div>
            <div className="stat-block">
              <span className="stat-value" style={{ color: 'var(--warning)' }}>{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-block">
              <span className="stat-value" style={{ color: 'var(--success)' }}>{acceptedCount}</span>
              <span className="stat-label">Chats</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="dashboard-quick-actions anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <Link to="/explore" className="quick-action-card glass-card">
            <span className="quick-action-icon">🔍</span>
            <span className="font-display quick-action-label">Browse Seniors</span>
          </Link>
          <Link to="/courses" className="quick-action-card glass-card">
            <span className="quick-action-icon">📚</span>
            <span className="font-display quick-action-label">Course Intel</span>
          </Link>
          <Link to="/skills" className="quick-action-card glass-card">
            <span className="quick-action-icon">⚡</span>
            <span className="font-display quick-action-label">Find Skill Help</span>
          </Link>
          <Link to="/inbox" className="quick-action-card glass-card">
            <span className="quick-action-icon">💬</span>
            <span className="font-display quick-action-label">My Inbox</span>
          </Link>
        </div>

        <div className="dashboard-grid">
          {/* Recommended students */}
          <div className="anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header-row">
              <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Recommended for You</h2>
              <Link to="/explore" className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>View all →</Link>
            </div>
            {recommended.length === 0 ? (
              <div className="glass-card empty-state" style={{ padding: 'var(--space-8)' }}>
                <p className="empty-state-title">No suggestions right now</p>
                <p className="empty-state-desc">More students will appear as they join.</p>
              </div>
            ) : (
              <div className="flex-col gap-4" style={{ display: 'flex' }}>
                {recommended.map((s) => (
                  <SeniorCard key={s.id} senior={s} onRequest={setRequestTarget} />
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="dashboard-right-col">
            {/* Recent interactions */}
            <div className="anim-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="section-header-row">
                <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Recent Interactions</h2>
                <Link to="/inbox" className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>View all →</Link>
              </div>
              {recent.length === 0 ? (
                <div className="glass-card empty-state" style={{ padding: 'var(--space-8)' }}>
                  <div className="empty-state-icon">💬</div>
                  <p className="empty-state-title">No interactions yet</p>
                  <p className="empty-state-desc">Browse students and send your first request!</p>
                </div>
              ) : (
                <div className="flex-col gap-3" style={{ display: 'flex' }}>
                  {recent.map((r) => {
                    const sentByMe = r.from_user === user?.id;
                    const other = sentByMe ? r.receiver : r.sender;
                    return (
                      <Link
                        key={r.id}
                        to={r.status === 'accepted' ? `/inbox/${r.id}` : '/inbox'}
                        className="interaction-preview glass-card"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="avatar-placeholder avatar-sm"
                            style={{
                              background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))',
                              fontSize: '0.65rem',
                            }}
                          >
                            {initialsOf(other?.name || 'S')}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>
                              {other?.name || 'Student'}
                            </p>
                            <p
                              className="text-muted"
                              style={{
                                fontSize: 'var(--text-xs)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {sentByMe ? 'You asked: ' : 'Asked you: '}
                              {previewOf(r.message)}
                            </p>
                          </div>
                          <span
                            className={`badge ${
                              r.status === 'accepted'
                                ? 'badge-success'
                                : r.status === 'pending'
                                ? 'badge-warning'
                                : 'badge-muted'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Suggested courses (abhi mock data) */}
            <div className="anim-fade-up" style={{ animationDelay: '0.4s', marginTop: 'var(--space-8)' }}>
              <div className="section-header-row">
                <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Explore Courses</h2>
                <Link to="/courses" className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>All →</Link>
              </div>
              <div className="flex-col gap-3" style={{ display: 'flex' }}>
                {suggestedCourses.map((c) => (
                  <Link key={c.id} to={`/course/${c.id}`} className="suggested-course-card glass-card">
                    <div className="flex justify-between items-center">
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.name}</p>
                        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                          {c.code} · Year {c.year}
                        </p>
                      </div>
                      <span className="badge badge-accent">⭐ {c.aggregatedExperience.avgRating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}
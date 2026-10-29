import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SENIORS } from '../../data/mockSeniors';
import { COURSES } from '../../data/mockCourses';
import { INTERACTIONS } from '../../data/mockInteractions';
import SeniorCard from '../../components/SeniorCard';
import RequestModal from '../../components/RequestModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [requestTarget, setRequestTarget] = useState(null);

  // Recent interactions (last 3)
  const myInteractions = INTERACTIONS.filter(
    (i) => i.senderId === (user?.id || 'stu-001')
  ).slice(-3).reverse();

  // Recommended seniors: those who have taken same courses as user
  const userCourses = user?.coursesTaken || [];
  const recommended = SENIORS.filter((s) =>
    s.coursesTaken.some((c) => userCourses.includes(c))
  ).sort((a, b) => b.reliabilityScore - a.reliabilityScore).slice(0, 3);

  // Suggested courses (not yet taken by user)
  const suggestedCourses = COURSES.filter(
    (c) => !userCourses.includes(c.id)
  ).slice(0, 3);

  const scoreColor =
    user?.reliabilityScore >= 85 ? 'var(--success)' :
    user?.reliabilityScore >= 70 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="page-content">
      <div className="container">
        {/* Welcome banner */}
        <div className="dashboard-welcome glass-card anim-fade-up">
          <div className="dashboard-welcome-left">
            <div
              className="avatar-placeholder"
              style={{
                width: 60, height: 60, fontSize: '1.2rem',
                background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))',
              }}
            >
             {(user?.name || user?.email || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: 'var(--text-2xl)' }}>
                Welcome back, {(user?.name || user?.email || 'User').split(' ')[0]}! 👋
              </h1>
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {user?.branch} · Year {user?.year}
              </p>
            </div>
          </div>
          <div className="dashboard-welcome-stats">
            <div className="stat-block">
              <span className="stat-value" style={{ color: scoreColor }}>{user?.reliabilityScore}</span>
              <span className="stat-label">Reliability Score</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{myInteractions.length}</span>
              <span className="stat-label">Interactions</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{user?.coursesTaken?.length || 0}</span>
              <span className="stat-label">Courses Taken</span>
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
          {/* Recommended seniors */}
          <div className="anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header-row">
              <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Recommended for You</h2>
              <Link to="/explore" className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>View all →</Link>
            </div>
            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              {recommended.map((s) => (
                <SeniorCard key={s.id} senior={s} onRequest={setRequestTarget} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="dashboard-right-col">
            {/* Recent interactions */}
            <div className="anim-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="section-header-row">
                <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Recent Interactions</h2>
                <Link to="/inbox" className="text-accent" style={{ fontSize: 'var(--text-sm)' }}>View all →</Link>
              </div>
              {myInteractions.length === 0 ? (
                <div className="glass-card empty-state" style={{ padding: 'var(--space-8)' }}>
                  <div className="empty-state-icon">💬</div>
                  <p className="empty-state-title">No interactions yet</p>
                  <p className="empty-state-desc">Browse seniors and send your first request!</p>
                </div>
              ) : (
                <div className="flex-col gap-3" style={{ display: 'flex' }}>
                  {myInteractions.map((i) => (
                    <Link key={i.id} to={`/inbox/${i.id}`} className="interaction-preview glass-card">
                      <div className="flex items-center gap-3">
                        <div
                          className="avatar-placeholder avatar-sm"
                          style={{
                            background: `linear-gradient(135deg, hsl(${i.seniorColorHue},70%,55%), hsl(${i.seniorColorHue + 40},70%,45%))`,
                            fontSize: '0.65rem',
                          }}
                        >
                          {i.seniorInitials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>
                            {i.seniorName}
                          </p>
                          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {i.messages[i.messages.length - 1]?.text}
                          </p>
                        </div>
                        <span className={`badge ${i.status === 'responded' ? 'badge-success' : i.status === 'pending' ? 'badge-warning' : 'badge-muted'}`}>
                          {i.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested courses */}
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
                        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{c.code} · Year {c.year}</p>
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

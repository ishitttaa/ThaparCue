import { useAuth } from '../../context/AuthContext';
import { INTERACTIONS } from '../../data/mockInteractions';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const myInteractions = INTERACTIONS.filter(
    (i) => i.senderId === (user?.id || 'stu-001')
  );
  const rated = myInteractions.filter((i) => i.isRated);
  const pending = myInteractions.filter((i) => i.status === 'pending');
  const responded = myInteractions.filter((i) => i.status === 'responded');

  const scoreColor =
    user?.reliabilityScore >= 85 ? 'var(--success)' :
    user?.reliabilityScore >= 70 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Account</span>
          <h1 className="font-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}>
            My Profile
          </h1>
        </div>

        <div className="profile-layout">
          {/* Left: Identity card */}
          <div className="profile-sidebar">
            <div className="glass-card profile-card anim-fade-up">
              <div className="profile-avatar-wrap">
                <div
                  className="avatar-placeholder"
                  style={{
                    width: 88, height: 88, fontSize: '1.6rem',
                    background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))',
                  }}
                >
                  {user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              </div>

              <h2 className="font-display" style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}>
                {user?.name}
              </h2>
              <p className="text-secondary" style={{ textAlign: 'center', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {user?.email}
              </p>
              <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{user?.branch}</span>
                <span className="badge badge-muted">Year {user?.year}</span>
              </div>

              {/* Reliability score */}
              <div className="profile-reliability-block" style={{ marginTop: 'var(--space-6)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-2)' }}>
                  <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>Reliability Score</span>
                  <span style={{ fontWeight: 700, color: scoreColor, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
                    {user?.reliabilityScore}
                  </span>
                </div>
                <div className="progress-bar-track" style={{ height: 8 }}>
                  <div className="progress-bar-fill" style={{ width: `${user?.reliabilityScore}%` }} />
                </div>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                  Based on your interaction history and community feedback
                </p>
              </div>

              <div className="divider" />

              <button className="btn btn-danger w-full" onClick={logout}>Logout</button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="profile-main">
            {/* Interaction stats */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display section-title">Interaction Stats</h2>
              <div className="profile-stats-grid">
                <div className="profile-stat">
                  <span className="profile-stat-val">{myInteractions.length}</span>
                  <span className="profile-stat-lbl">Total Requests</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: 'var(--success)' }}>{responded.length}</span>
                  <span className="profile-stat-lbl">Responded</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: 'var(--warning)' }}>{pending.length}</span>
                  <span className="profile-stat-lbl">Pending</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: 'var(--accent-light)' }}>{rated.length}</span>
                  <span className="profile-stat-lbl">Rated</span>
                </div>
              </div>
              <Link to="/inbox" className="btn btn-secondary w-full" style={{ marginTop: 'var(--space-4)' }}>
                View Inbox
              </Link>
            </div>

            {/* Skills */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display section-title">My Skills</h2>
              {user?.skills && user.skills.length > 0 ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {user.skills.map((sk) => (
                    <span key={sk} className="tag active">{sk}</span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills added yet.</p>
              )}
            </div>

            {/* Courses taken */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-display section-title">Courses Taken</h2>
              {user?.coursesTaken && user.coursesTaken.length > 0 ? (
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {user.coursesTaken.map((c) => (
                    <Link key={c} to={`/course/${c}`} className="course-taken-chip">
                      <span className="course-taken-code">{c}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No courses listed.</p>
              )}
            </div>

            {/* Recent interactions */}
            {myInteractions.length > 0 && (
              <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="font-display section-title">Recent Activity</h2>
                <div className="flex-col gap-3" style={{ display: 'flex' }}>
                  {myInteractions.slice(0, 4).reverse().map((i) => (
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
                          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{i.seniorName}</p>
                          <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{i.topicLabel}</p>
                        </div>
                        <span className={`badge ${i.status === 'responded' ? 'badge-success' : i.status === 'pending' ? 'badge-warning' : 'badge-muted'}`}>
                          {i.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

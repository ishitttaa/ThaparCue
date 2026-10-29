import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSeniorById } from '../../data/mockSeniors';
import { getCourseById } from '../../data/mockCourses';
import RequestModal from '../../components/RequestModal';

const proficiencyColor = {
  Expert: 'badge-accent',
  Advanced: 'badge-success',
  Intermediate: 'badge-warning',
};

export default function SeniorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const senior = getSeniorById(id);
  const [showModal, setShowModal] = useState(false);

  if (!senior) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">😕</div>
          <p className="empty-state-title">Senior not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/explore')}>Back to Explore</button>
        </div>
      </div>
    );
  }

  const sharedCourses = senior.coursesTaken
    .map((cId) => getCourseById(cId))
    .filter(Boolean);

  const scoreColor =
    senior.reliabilityScore >= 90 ? 'var(--success)' :
    senior.reliabilityScore >= 80 ? 'var(--accent-light)' : 'var(--warning)';

  return (
    <div className="page-content">
      <div className="container">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)' }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="profile-layout">
          {/* Left: Profile Card */}
          <div className="profile-sidebar">
            <div className="glass-card profile-card anim-fade-up">
              <div className="profile-avatar-wrap">
                <div
                  className="avatar-placeholder"
                  style={{
                    width: 88, height: 88, fontSize: '1.6rem',
                    background: `linear-gradient(135deg, hsl(${senior.colorHue},70%,55%), hsl(${senior.colorHue + 40},70%,45%))`,
                  }}
                >
                  {senior.initials}
                </div>
                {senior.reliabilityScore >= 90 && (
                  <div className="profile-top-badge">✦ Top Contributor</div>
                )}
              </div>

              <h1 className="font-display" style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}>
                {senior.name}
              </h1>
              <p className="text-secondary" style={{ textAlign: 'center', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {senior.branch}
              </p>
              <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: 'var(--space-3)' }}>
                {senior.isAlumni
                  ? <span className="badge badge-success">Alumni</span>
                  : <span className="badge badge-accent">Year {senior.currentYear}</span>
                }
                {senior.isAlumni && <span className="badge badge-muted">Class of {senior.graduationYear}</span>}
              </div>

              <p className="profile-bio text-secondary">{senior.bio}</p>

              <button
                className="btn btn-primary w-full"
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => setShowModal(true)}
              >
                Send Request
              </button>

              {/* Stats */}
              <div className="profile-stats-grid">
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: scoreColor }}>
                    {senior.reliabilityScore}
                  </span>
                  <span className="profile-stat-lbl">Reliability</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">⭐ {senior.rating.toFixed(1)}</span>
                  <span className="profile-stat-lbl">Rating</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">{senior.responseRate}%</span>
                  <span className="profile-stat-lbl">Response Rate</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">{senior.totalInteractions}</span>
                  <span className="profile-stat-lbl">Interactions</span>
                </div>
              </div>

              <div className="divider" />

              <div>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
                  Avg Response Time
                </p>
                <p style={{ fontWeight: 600, color: 'var(--text-accent)' }}>{senior.avgResponseTime}</p>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="profile-main">
            {/* Skills */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display section-title">Skills &amp; Expertise</h2>
              <div className="skills-list">
                {senior.skills.map((sk) => (
                  <div key={sk.name} className="skill-row">
                    <div className="flex items-center gap-3" style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600 }}>{sk.name}</span>
                      <span className={`badge ${proficiencyColor[sk.proficiency] || 'badge-muted'}`}>
                        {sk.proficiency}
                      </span>
                    </div>
                    <div className="progress-bar-track" style={{ width: 120 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: sk.proficiency === 'Expert' ? '100%' :
                                 sk.proficiency === 'Advanced' ? '75%' : '50%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Taken */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display section-title">Courses Taken</h2>
              <div className="courses-taken-grid">
                {sharedCourses.map((c) => (
                  <Link key={c.id} to={`/course/${c.id}`} className="course-taken-chip">
                    <span className="course-taken-code">{c.code}</span>
                    <span className="course-taken-name text-secondary">{c.shortName}</span>
                  </Link>
                ))}
                {senior.coursesTaken
                  .filter((id) => !sharedCourses.find((c) => c.id === id))
                  .map((id) => (
                    <span key={id} className="course-taken-chip course-taken-unknown">
                      <span className="course-taken-code">{id}</span>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <RequestModal senior={senior} onClose={() => setShowModal(false)} />}
    </div>
  );
}

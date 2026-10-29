import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../hooks/useProfiles';
import RequestModal from '../../components/RequestModal';

export default function SeniorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: student, isPending } = useStudent(id);
  const [showModal, setShowModal] = useState(false);

  if (isPending) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">😕</div>
          <p className="empty-state-title">Profile not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/explore')}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const isMe = student.id === user?.id;

  return (
    <div className="page-content">
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 'var(--space-4)' }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="glass-card profile-card anim-fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="profile-avatar-wrap">
            <div
              className="avatar-placeholder"
              style={{
                width: 88,
                height: 88,
                fontSize: '1.6rem',
                background: `linear-gradient(135deg, hsl(${student.colorHue},70%,55%), hsl(${student.colorHue + 40},70%,45%))`,
              }}
            >
              {student.initials}
            </div>
          </div>

          <h1 className="font-display" style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}>
            {student.name}
          </h1>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: 'var(--text-sm)', marginTop: 4 }}>
            {student.branch}
          </p>

          {student.currentYear && (
            <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: 'var(--space-3)' }}>
              <span className="badge badge-accent">Year {student.currentYear}</span>
            </div>
          )}

          <p className="profile-bio text-secondary">{student.bio}</p>

          {isMe ? (
            <Link to="/profile" className="btn btn-ghost w-full" style={{ marginTop: 'var(--space-4)' }}>
              This is you · View my profile
            </Link>
          ) : (
            <button
              className="btn btn-primary w-full"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={() => setShowModal(true)}
            >
              Send Request
            </button>
          )}
        </div>
      </div>

      {showModal && <RequestModal senior={student} onClose={() => setShowModal(false)} />}
    </div>
  );
}
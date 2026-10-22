import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES } from '../data/mockCourses';
import { TOPIC_OPTIONS, addInteraction } from '../data/mockInteractions';
import { useAuth } from '../context/AuthContext';

export default function RequestModal({ senior, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic) { setError('Please select a topic.'); return; }
    if (!message.trim() || message.trim().length < 20) {
      setError('Please write at least 20 characters.');
      return;
    }

    const newId = `int-${Date.now()}`;
    const selectedCourse = COURSES.find((c) => c.id === courseId);
    const selectedTopic = TOPIC_OPTIONS.find((t) => t.value === topic);

    const interaction = {
      id: newId,
      requestId: `req-${Date.now()}`,
      senderId: user?.id || 'stu-001',
      receiverId: senior.id,
      seniorName: senior.name,
      seniorInitials: senior.initials,
      seniorColorHue: senior.colorHue,
      topic: topic,
      topicLabel: selectedTopic?.label || topic,
      courseId: courseId || null,
      courseName: selectedCourse?.shortName || null,
      purpose: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: user?.id || 'stu-001',
          text: message.trim(),
          sentAt: new Date().toISOString(),
        },
      ],
      rating: null,
      isRated: false,
    };

    addInteraction(interaction);
    setStep('success');

    setTimeout(() => {
      onClose();
      navigate(`/inbox/${newId}`);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {step === 'success' ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem' }}>✅</div>
            <h3 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>Request Sent!</h3>
            <p className="text-secondary">
              Your request has been sent to <strong>{senior.name}</strong>. Redirecting to inbox…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-header" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="avatar-placeholder avatar-md"
                  style={{
                    background: `linear-gradient(135deg, hsl(${senior.colorHue},70%,55%), hsl(${senior.colorHue + 40},70%,45%))`,
                    fontSize: '0.85rem',
                  }}
                >
                  {senior.initials}
                </div>
                <div>
                  <h2 className="font-display" style={{ fontSize: 'var(--text-lg)', marginBottom: 2 }}>
                    Request from {senior.name}
                  </h2>
                  <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{senior.branch}</p>
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: 'var(--danger-dim)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                  color: '#f87171',
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {error}
              </div>
            )}

            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              {/* Topic */}
              <div className="form-group">
                <label className="form-label">What do you need help with?</label>
                <div className="topic-grid">
                  {TOPIC_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`topic-btn ${topic === t.value ? 'active' : ''}`}
                      onClick={() => { setTopic(t.value); setError(''); }}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course (optional) */}
              <div className="form-group">
                <label className="form-label">Related course (optional)</label>
                <select
                  className="form-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">No specific course</option>
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label">Your message</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe your question or what you'd like guidance on…"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(''); }}
                  style={{ resize: 'vertical', minHeight: 100 }}
                />
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {message.trim().length}/20 chars minimum
                </span>
              </div>
            </div>

            <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

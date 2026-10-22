import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { addMessage, submitRating, INTERACTIONS } from '../data/mockInteractions';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 'stu-001';

  // Re-derive interaction from module-level array each render
  const interaction = INTERACTIONS.find((i) => i.id === id);

  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [ratingVal, setRatingVal] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rated, setRated] = useState(interaction?.isRated || false);
  const [, forceRender] = useState(0);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interaction?.messages?.length]);

  if (!interaction) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">💬</div>
          <p className="empty-state-title">Conversation not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/inbox')}>Back to Inbox</button>
        </div>
      </div>
    );
  }

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) +
      ' · ' + d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleSend = () => {
    if (!reply.trim()) return;
    setSending(true);
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      text: reply.trim(),
      sentAt: new Date().toISOString(),
    };
    addMessage(id, msg);
    setReply('');
    setSending(false);
    forceRender((n) => n + 1);
  };

  const handleRate = () => {
    if (ratingVal === 0) return;
    submitRating(id, { relevanceScore: ratingVal, appropriate: true });
    setRated(true);
    setShowRating(false);
    forceRender((n) => n + 1);
  };

  const canRate = interaction.status === 'responded' && !rated && !interaction.isRated;

  return (
    <div className="page-content" style={{ paddingBottom: 0 }}>
      <div className="chat-layout container">
        {/* Chat header */}
        <div className="chat-header glass-card anim-fade-up">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/inbox')}>← Inbox</button>
          <div className="flex items-center gap-3" style={{ flex: 1 }}>
            <div
              className="avatar-placeholder avatar-md"
              style={{
                background: `linear-gradient(135deg, hsl(${interaction.seniorColorHue},70%,55%), hsl(${interaction.seniorColorHue + 40},70%,45%))`,
                fontSize: '0.8rem',
              }}
            >
              {interaction.seniorInitials}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{interaction.seniorName}</p>
              <div className="flex items-center gap-2">
                <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{interaction.topicLabel}</span>
                {interaction.courseName && (
                  <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{interaction.courseName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${interaction.status === 'responded' ? 'badge-success' : interaction.status === 'pending' ? 'badge-warning' : 'badge-muted'}`}>
              {interaction.status}
            </span>
            <Link to={`/senior/${interaction.receiverId}`} className="btn btn-ghost btn-sm">
              View Profile
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages anim-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Purpose / context bar */}
          <div className="chat-context-bar">
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Request context:</span>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
              {interaction.purpose}
            </p>
          </div>

          {interaction.messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg.id} className={`chat-bubble-wrap ${isMe ? 'chat-bubble-right' : 'chat-bubble-left'}`}>
                {!isMe && (
                  <div
                    className="avatar-placeholder"
                    style={{
                      width: 28, height: 28, fontSize: '0.6rem', flexShrink: 0,
                      background: `linear-gradient(135deg, hsl(${interaction.seniorColorHue},70%,55%), hsl(${interaction.seniorColorHue + 40},70%,45%))`,
                    }}
                  >
                    {interaction.seniorInitials}
                  </div>
                )}
                <div className="flex-col" style={{ display: 'flex', maxWidth: '70%' }}>
                  <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                    {msg.text}
                  </div>
                  <span className={`chat-time ${isMe ? 'text-right' : ''} text-muted`}>
                    {formatTime(msg.sentAt)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Rating prompt */}
          {canRate && (
            <div className="chat-rate-prompt glass-card">
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Was this guidance helpful?
              </p>
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                Rate your interaction with {interaction.seniorName}
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowRating(true)}>
                Rate Interaction
              </button>
            </div>
          )}

          {(rated || interaction.isRated) && (
            <div className="chat-rated-banner">
              ✅ You rated this interaction — thank you for your feedback!
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Reply bar */}
        <div className="chat-reply-bar glass-card anim-fade-up" style={{ animationDelay: '0.2s' }}>
          <textarea
            className="form-input chat-reply-input"
            placeholder="Write your reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            rows={2}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={sending || !reply.trim()}
          >
            {sending ? <span className="spinner" /> : 'Send ↑'}
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowRating(false)}>
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
              Rate your experience
            </h2>
            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              How relevant and helpful was the guidance from {interaction.seniorName}?
            </p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= (hoverStar || ratingVal) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setRatingVal(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
              {ratingVal === 0 ? 'Select a rating' : ['', 'Not helpful', 'Somewhat helpful', 'Helpful', 'Very helpful', 'Extremely helpful'][ratingVal]}
            </p>
            <div className="flex gap-3" style={{ justifyContent: 'center', marginTop: 'var(--space-6)' }}>
              <button className="btn btn-ghost" onClick={() => setShowRating(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRate} disabled={ratingVal === 0}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

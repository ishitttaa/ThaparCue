import { Link } from 'react-router-dom';
import { INTERACTIONS } from '../data/mockInteractions';
import { useAuth } from '../context/AuthContext';

const STATUS_TAB_ORDER = ['all', 'pending', 'responded', 'closed'];
const STATUS_LABELS = { all: 'All', pending: 'Pending', responded: 'Responded', closed: 'Closed' };

import { useState } from 'react';

export default function InboxPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('all');

  const myInteractions = INTERACTIONS.filter(
    (i) => i.senderId === (user?.id || 'stu-001')
  );

  const filtered =
    tab === 'all' ? myInteractions : myInteractions.filter((i) => i.status === tab);

  const counts = STATUS_TAB_ORDER.reduce((acc, t) => {
    acc[t] = t === 'all' ? myInteractions.length : myInteractions.filter((i) => i.status === t).length;
    return acc;
  }, {});

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Conversations</span>
          <h1 className="font-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}>
            My Inbox
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)' }}>
            All your guidance requests and conversations with seniors.
          </p>
        </div>

        {/* Tabs */}
        <div className="inbox-tabs anim-fade-up" style={{ animationDelay: '0.1s' }}>
          {STATUS_TAB_ORDER.map((t) => (
            <button
              key={t}
              className={`inbox-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {STATUS_LABELS[t]}
              {counts[t] > 0 && (
                <span className="inbox-tab-count">{counts[t]}</span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state glass-card anim-fade-up">
            <div className="empty-state-icon">💬</div>
            <p className="empty-state-title">No {tab === 'all' ? '' : tab} interactions</p>
            <p className="empty-state-desc">
              {tab === 'all'
                ? 'Browse seniors and send your first request!'
                : `No ${tab} conversations right now.`}
            </p>
            {tab === 'all' && (
              <Link to="/explore" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                Browse Seniors
              </Link>
            )}
          </div>
        ) : (
          <div className="inbox-list anim-fade-up" style={{ animationDelay: '0.15s' }}>
            {filtered.map((i) => {
              const lastMsg = i.messages[i.messages.length - 1];
              const isUnread = i.status === 'responded';
              return (
                <Link key={i.id} to={`/inbox/${i.id}`} className={`inbox-item glass-card ${isUnread ? 'inbox-item-unread' : ''}`}>
                  <div
                    className="avatar-placeholder avatar-md"
                    style={{
                      background: `linear-gradient(135deg, hsl(${i.seniorColorHue},70%,55%), hsl(${i.seniorColorHue + 40},70%,45%))`,
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {i.seniorInitials}
                  </div>

                  <div className="inbox-item-content">
                    <div className="inbox-item-header">
                      <span className="inbox-item-name font-display">{i.seniorName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${i.status === 'responded' ? 'badge-success' : i.status === 'pending' ? 'badge-warning' : 'badge-muted'}`}>
                          {i.status}
                        </span>
                        <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                          {formatTime(i.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{i.topicLabel}</span>
                      {i.courseName && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{i.courseName}</span>}
                    </div>

                    <p className="inbox-item-preview text-secondary">
                      {lastMsg?.senderId === (user?.id || 'stu-001') ? 'You: ' : `${i.seniorName.split(' ')[0]}: `}
                      {lastMsg?.text}
                    </p>
                  </div>

                  {isUnread && <div className="notif-dot" style={{ flexShrink: 0 }} />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

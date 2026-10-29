import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useChatMessages,
  useChatRequest,
  useSendMessage,
} from '../../hooks/useChat';

function formatTime(iso) {
  const date = new Date(iso);
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${time} · ${day}`;
}

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reply, setReply] = useState('');
  const bottomRef = useRef(null);

  const { data: request, isPending, error: requestError } = useChatRequest(id);
  const { data: messages = [] } = useChatMessages(id, !!request);
  const send = useSendMessage(id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const content = reply.trim();
    if (!content || send.isPending) return;
    send.mutate(content, { onSuccess: () => setReply('') });
  };

  if (isPending) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">💬</div>
          <p className="empty-state-title">Conversation not available</p>
          <p>
            {requestError
              ? 'Could not load this chat. Please try again.'
              : 'This chat is unavailable. Only accepted requests can be opened.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/inbox')}>
            Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  const sentByMe = request.from_user === user.id;
  const other = sentByMe ? request.receiver : request.sender;
  const initials = (other?.name || 'Student')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page-content" style={{ paddingBottom: 0 }}>
      <div className="chat-layout container">
        <div className="chat-header glass-card anim-fade-up">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/inbox')}>
            ← Inbox
          </button>

          <div className="flex items-center gap-3" style={{ flex: 1 }}>
            <div className="avatar-placeholder avatar-md">{initials}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
                {other?.name || 'Student'}
              </p>
              <div className="flex items-center gap-2">
                {other?.branch && <span className="badge badge-muted">{other.branch}</span>}
                <span className="badge badge-success">accepted</span>
              </div>
            </div>
          </div>

          {other?.id && (
            <Link to={`/senior/${other.id}`} className="btn btn-ghost btn-sm">
              View Profile
            </Link>
          )}
        </div>

        <div className="chat-messages anim-fade-up">
          <div className="chat-context-bar">
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Request context:
            </span>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
              {request.message || 'Skill-sharing conversation'}
            </p>
          </div>

          {messages.length === 0 && (
            <div className="empty-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}

          {messages.map((message) => {
            const isMe = message.sender_id === user.id;
            return (
              <div
                key={message.id}
                className={`chat-bubble-wrap ${isMe ? 'chat-bubble-right' : 'chat-bubble-left'}`}
              >
                {!isMe && (
                  <div
                    className="avatar-placeholder"
                    style={{ width: 28, height: 28, fontSize: '0.6rem', flexShrink: 0 }}
                  >
                    {initials}
                  </div>
                )}
                <div className="flex-col" style={{ display: 'flex', maxWidth: '70%' }}>
                  <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                    {message.content}
                  </div>
                  <span className={`chat-time ${isMe ? 'text-right' : ''} text-muted`}>
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {send.error && (
          <p className="error-message" role="alert">
            {send.error.message || 'Message could not be sent.'}
          </p>
        )}

        <div className="chat-reply-bar glass-card anim-fade-up" style={{ animationDelay: '0.2s' }}>
          <textarea
            className="form-input chat-reply-input"
            placeholder="Write your reply…"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            rows={2}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={send.isPending || !reply.trim()}
          >
            {send.isPending ? <span className="spinner" /> : 'Send ↑'}
          </button>
        </div>
      </div>
    </div>
  );
}
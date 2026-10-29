
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const bottomRef = useRef(null);

  const loadChat = useCallback(async () => {
    if (!user?.id || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select(`
          id,
          from_user,
          to_user,
          message,
          status,
          created_at,
          sender:profiles!requests_from_user_fkey(id, name, branch),
          receiver:profiles!requests_to_user_fkey(id, name, branch)
        `)
        .eq('id', id)
        .maybeSingle();

      if (requestError) throw requestError;

      if (
        !requestData ||
        ![requestData.from_user, requestData.to_user].includes(user.id) ||
        requestData.status !== 'accepted'
      ) {
        setRequest(null);
        setMessages([]);
        setError('This chat is unavailable. Only accepted requests can be opened.');
        return;
      }

      setRequest(requestData);

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('id, request_id, sender_id, content, created_at')
        .eq('request_id', id)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;

      setMessages(messageData || []);
    } catch (err) {
      console.error('Chat load error:', err);
      setError(err.message || 'This chat is unavailable.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  // Load the accepted conversation.
  useEffect(() => {
    loadChat();
  }, [loadChat]);

  // Redirect if this request stops being accepted.
  useEffect(() => {
    if (!user?.id || !id || !request) return;

    let redirected = false;

    const channel = supabase
      .channel(`request-status-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requests',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updated = payload.new;

          if (
            updated.status !== 'accepted' ||
            ![updated.from_user, updated.to_user].includes(user.id)
          ) {
            redirected = true;
            setRequest(null);
            setMessages([]);
            navigate('/inbox', { replace: true });
          } else {
            setRequest((current) =>
              current ? { ...current, ...updated } : current
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user?.id, navigate, request?.id]);

  // Receive new messages in real time.
  useEffect(() => {
    if (!user?.id || !id || !request) return;

    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `request_id=eq.${id}`,
        },
        (payload) => {
          const incoming = payload.new;

          setMessages((current) => {
            if (current.some((message) => message.id === incoming.id)) {
              return current;
            }

            return [...current, incoming].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user?.id, request?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    const content = reply.trim();

    if (!content || sending || !user?.id || !request) return;

    setSending(true);
    setError('');

    try {
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          request_id: id,
          sender_id: user.id,
          content,
        })
        .select('id, request_id, sender_id, content, created_at')
        .single();

      if (sendError) throw sendError;

      setMessages((current) => {
        if (current.some((message) => message.id === data.id)) {
          return current;
        }

        return [...current, data].sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      });

      setReply('');
    } catch (err) {
      console.error('Send message error:', err);
      setError(err.message || 'Message send nahi ho paaya.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    const date = new Date(iso);

    return (
      date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) +
      ' · ' +
      date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      })
    );
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">💬</div>
          <p className="empty-state-title">Conversation not available</p>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/inbox')}
          >
            Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  if (!request || !user?.id) return null;

  const sentByMe = request.from_user === user.id;
  const otherPerson = sentByMe ? request.receiver : request.sender;

  const initials = (otherPerson?.name || 'Student')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page-content" style={{ paddingBottom: 0 }}>
      <div className="chat-layout container">
        <div className="chat-header glass-card anim-fade-up">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/inbox')}
          >
            ← Inbox
          </button>

          <div className="flex items-center gap-3" style={{ flex: 1 }}>
            <div className="avatar-placeholder avatar-md">
              {initials}
            </div>

            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
                {otherPerson?.name || 'Student'}
              </p>

              <div className="flex items-center gap-2">
                {otherPerson?.branch && (
                  <span className="badge badge-muted">
                    {otherPerson.branch}
                  </span>
                )}
                <span className="badge badge-success">accepted</span>
              </div>
            </div>
          </div>

          {otherPerson?.id && (
            <Link
              to={`/senior/${otherPerson.id}`}
              className="btn btn-ghost btn-sm"
            >
              View Profile
            </Link>
          )}
        </div>

        <div className="chat-messages anim-fade-up">
          <div className="chat-context-bar">
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Request context:
            </span>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                marginTop: 4,
              }}
            >
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
                className={`chat-bubble-wrap ${
                  isMe ? 'chat-bubble-right' : 'chat-bubble-left'
                }`}
              >
                {!isMe && (
                  <div
                    className="avatar-placeholder"
                    style={{
                      width: 28,
                      height: 28,
                      fontSize: '0.6rem',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                )}

                <div
                  className="flex-col"
                  style={{ display: 'flex', maxWidth: '70%' }}
                >
                  <div
                    className={`chat-bubble ${
                      isMe ? 'chat-bubble-me' : 'chat-bubble-them'
                    }`}
                  >
                    {message.content}
                  </div>

                  <span
                    className={`chat-time ${
                      isMe ? 'text-right' : ''
                    } text-muted`}
                  >
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <div
          className="chat-reply-bar glass-card anim-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
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
            disabled={sending || !reply.trim()}
          >
            {sending ? <span className="spinner" /> : 'Send ↑'}
          </button>
        </div>
      </div>
    </div>
  );
}

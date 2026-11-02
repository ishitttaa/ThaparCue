import StarRating from './StarRating';
import { useMyRating, useRateHelper } from '../hooks/useRatings';

export default function RateHelper({ request, messages, userId }) {
  const { data: myStars = null } = useMyRating(request.id);
  const rate = useRateHelper(request.id);

  const sentByMe = request.from_user === userId;
  const otherId = sentByMe ? request.to_user : request.from_user;
  const otherName =
    (sentByMe ? request.receiver?.name : request.sender?.name) || 'this student';

  const iSpoke = messages.some((m) => m.sender_id === userId);
  const theySpoke = messages.some((m) => m.sender_id === otherId);
  const canRate = iSpoke && theySpoke;

  return (
    <div
      className="glass-card"
      style={{ padding: 'var(--space-3) var(--space-4)', margin: 'var(--space-3) 0' }}
    >
      {canRate ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>
            {myStars
              ? `Your rating for ${otherName}`
              : `How was your conversation with ${otherName}?`}
          </span>
          <StarRating
            value={myStars ?? 0}
            disabled={rate.isPending}
            onChange={(stars) => rate.mutate(stars)}
          />
          {myStars && (
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Thanks! You can change it anytime.
            </span>
          )}
        </div>
      ) : (
        <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
          You can rate your conversation with {otherName} once you have both sent a message.
        </span>
      )}
      {rate.error && (
        <p
          role="alert"
          style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}
        >
          {rate.error.message || 'Could not save your rating.'}
        </p>
      )}
    </div>
  );
}
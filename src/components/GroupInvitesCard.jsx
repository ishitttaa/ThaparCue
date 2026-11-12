import { toast } from 'sonner';
import { useMyInvites, useRespondToInvite } from '../hooks/useGroups';

export default function GroupInvitesCard() {
    const { data: invites = [], isPending } = useMyInvites();
    const respond = useRespondToInvite();

    if (isPending || invites.length === 0) return null;

    const answer = (inviteId, accept) =>
        respond.mutate(
            { inviteId, accept },
            {
                onSuccess: () => toast.success(accept ? 'Group join ho gaya!' : 'Invite decline kiya'),
                onError: (err) => toast.error(err.message || 'Invite ka jawab nahi diya ja saka'),
            }
        );

    return (
        <div className="glass-card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <p style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                Group invites ({invites.length})
            </p>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {invites.map((inv) => (
                    <div
                        key={inv.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <span>
                            <strong>{inv.group?.name || 'Group'}</strong>{' '}
                            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                                from {inv.inviter?.name || 'a student'}
                            </span>
                        </span>
                        <span style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                disabled={respond.isPending}
                                onClick={() => answer(inv.id, false)}
                            >
                                Decline
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={respond.isPending}
                                onClick={() => answer(inv.id, true)}
                            >
                                Accept
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
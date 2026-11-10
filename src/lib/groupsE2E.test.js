import { describe, expect, it } from 'vitest';

/**
 * End-to-End Simulation of Groups Lifecycle & Business Rules
 */
describe('Groups Lifecycle & Business Logic Integration', () => {
  // Mock State Store simulating Supabase database state in memory
  const db = {
    groups: [],
    group_members: [],
    group_messages: [],
  };

  function createGroup({ name, category, description, max_members, userId }) {
    if (!name?.trim()) throw new Error('Group name is required');
    const group = {
      id: `group-${db.groups.length + 1}`,
      name: name.trim(),
      category: category || 'general',
      description: description || '',
      max_members: Number(max_members) || 10,
      created_by: userId,
      created_at: new Date().toISOString(),
      is_open: true,
    };
    db.groups.push(group);

    // Auto-join creator as admin
    db.group_members.push({
      id: `gm-${db.group_members.length + 1}`,
      group_id: group.id,
      user_id: userId,
      role: 'admin',
      joined_at: new Date().toISOString(),
    });

    return group;
  }

  function joinGroup(groupId, userId) {
    const group = db.groups.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');
    if (!group.is_open) throw new Error('Group is closed');

    const members = db.group_members.filter((m) => m.group_id === groupId);
    const alreadyJoined = members.some((m) => m.user_id === userId);
    if (alreadyJoined) throw new Error('User already in group');

    if (group.max_members && members.length >= group.max_members) {
      throw new Error('Group is full');
    }

    const member = {
      id: `gm-${db.group_members.length + 1}`,
      group_id: groupId,
      user_id: userId,
      role: 'member',
      joined_at: new Date().toISOString(),
    };
    db.group_members.push(member);
    return member;
  }

  function leaveGroup(groupId, userId) {
    const members = db.group_members.filter((m) => m.group_id === groupId);
    const myMembership = members.find((m) => m.user_id === userId);
    if (!myMembership) throw new Error('Not a member');

    // Single admin protection
    const admins = members.filter((m) => m.role === 'admin');
    if (myMembership.role === 'admin' && admins.length === 1 && members.length > 1) {
      throw new Error('Sole admin cannot leave without appointing another admin');
    }

    db.group_members = db.group_members.filter(
      (m) => !(m.group_id === groupId && m.user_id === userId)
    );
    return true;
  }

  function sendGroupMessage(groupId, userId, content) {
    if (!content?.trim()) throw new Error('Message cannot be empty');
    const isMember = db.group_members.some(
      (m) => m.group_id === groupId && m.user_id === userId
    );
    if (!isMember) throw new Error('Security policy violation: Only members can post messages');

    const message = {
      id: `msg-${db.group_messages.length + 1}`,
      group_id: groupId,
      sender_id: userId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    db.group_messages.push(message);
    return message;
  }

  // --- Tests ---

  it('Step 1: Successfully creates a hackathon group and assigns creator as admin', () => {
    const group = createGroup({
      name: 'HackIndia 2026 Team',
      category: 'hackathon',
      description: 'Building AI for education',
      max_members: 3,
      userId: 'user-alice',
    });

    expect(group.id).toBeDefined();
    expect(group.name).toBe('HackIndia 2026 Team');
    expect(group.category).toBe('hackathon');

    const members = db.group_members.filter((m) => m.group_id === group.id);
    expect(members).toHaveLength(1);
    expect(members[0].user_id).toBe('user-alice');
    expect(members[0].role).toBe('admin');
  });

  it('Step 2: Prevents duplicate joins by the same student', () => {
    const groupId = 'group-1';
    expect(() => joinGroup(groupId, 'user-alice')).toThrow('User already in group');
  });

  it('Step 3: Allows students to join until capacity is reached', () => {
    const groupId = 'group-1';

    // Bob joins (member 2)
    const bob = joinGroup(groupId, 'user-bob');
    expect(bob.role).toBe('member');

    // Charlie joins (member 3 - reaches limit of 3)
    const charlie = joinGroup(groupId, 'user-charlie');
    expect(charlie.role).toBe('member');

    // Dave tries to join (member 4 - should fail)
    expect(() => joinGroup(groupId, 'user-dave')).toThrow('Group is full');
  });

  it('Step 4: Restricts messages to verified members only (Security & RLS)', () => {
    const groupId = 'group-1';

    // Alice (admin) sends message
    const msg1 = sendGroupMessage(groupId, 'user-alice', 'Welcome team!');
    expect(msg1.content).toBe('Welcome team!');

    // Bob (member) sends message
    const msg2 = sendGroupMessage(groupId, 'user-bob', 'Glad to be here.');
    expect(msg2.content).toBe('Glad to be here.');

    // Dave (non-member) tries to send message
    expect(() => sendGroupMessage(groupId, 'user-dave', 'Can I join?')).toThrow(
      'Security policy violation: Only members can post messages'
    );
  });

  it('Step 5: Enforces admin protection when leaving the group', () => {
    const groupId = 'group-1';

    // Bob (regular member) can leave freely
    expect(leaveGroup(groupId, 'user-bob')).toBe(true);

    // Alice (sole admin while Charlie is still member) cannot leave without transfer
    expect(() => leaveGroup(groupId, 'user-alice')).toThrow(
      'Sole admin cannot leave without appointing another admin'
    );
  });
});

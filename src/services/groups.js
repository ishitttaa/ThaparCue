import { supabase } from '../lib/supabase';

const GROUP_COLS = `
  id, name, description, category, created_by, created_at, max_members, is_open,
  creator:profiles!created_by(id, name, branch),
  members:group_members(count),
  my_membership:group_members(user_id)
`;

export async function getGroups({ category } = {}) {
  let q = supabase
    .from('groups')
    .select(GROUP_COLS)
    .order('created_at', { ascending: false });
  if (category && category !== 'all') q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getGroup(id) {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      id, name, description, category, created_by, created_at, max_members, is_open,
      creator:profiles!created_by(id, name, branch),
      members:group_members(id, role, joined_at, user:profiles!user_id(id, name, branch, year))
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createGroup({ name, description, category, maxMembers, userId }) {
  const cleanName = (name || '').trim();
  if (cleanName.length < 2) throw new Error('Group name must be at least 2 characters.');
  if (cleanName.length > 100) throw new Error('Group name cannot exceed 100 characters.');

  const cleanDesc = (description || '').trim().slice(0, 500);
  const validCategories = ['hackathon', 'competition', 'event', 'general'];
  const cleanCat = validCategories.includes(category) ? category : 'general';
  const clampedMembers = Math.min(Math.max(Number(maxMembers) || 10, 2), 100);

  // Insert group
  const { data: group, error: gErr } = await supabase
    .from('groups')
    .insert({
      name: cleanName,
      description: cleanDesc,
      category: cleanCat,
      max_members: clampedMembers,
      created_by: userId,
    })
    .select('id')
    .single();
  if (gErr) throw gErr;

  // Auto-join as admin
  const { error: mErr } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: userId, role: 'admin' });
  if (mErr) throw mErr;

  return group;
}

export async function joinGroup(groupId, userId) {
  const { data, error } = await supabase
    .from('group_members')
    .insert({ group_id: groupId, user_id: userId, role: 'member' })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

export async function leaveGroup(groupId, userId) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function deleteGroup(groupId) {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId);
  if (error) throw error;
}

export async function addMemberToGroup({ groupId, userId, role = 'member' }) {
  const { data, error } = await supabase
    .from('group_members')
    .insert({ group_id: groupId, user_id: userId, role })
    .select('id, role, joined_at, user:profiles!user_id(id, name, branch, year)')
    .single();
  if (error) throw error;
  return data;
}

export async function removeMemberFromGroup({ groupId, userId }) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function getGroupMessages(groupId) {
  const { data, error } = await supabase
    .from('group_messages')
    .select('id, group_id, sender_id, content, created_at, sender:profiles!sender_id(id, name, branch)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendGroupMessage({ groupId, senderId, content }) {
  const cleanContent = (content || '').trim();
  if (!cleanContent) throw new Error('Message content cannot be empty.');
  if (cleanContent.length > 4000) throw new Error('Message cannot exceed 4,000 characters.');

  const { data, error } = await supabase
    .from('group_messages')
    .insert({ group_id: groupId, sender_id: senderId, content: cleanContent })
    .select('id, group_id, sender_id, content, created_at, sender:profiles!sender_id(id, name, branch)')
    .single();
  if (error) throw error;
  return data;
}
export async function inviteToGroup({ groupId, userId, invitedBy }) {
  const { data, error } = await supabase
    .from('group_invites')
    .insert({ group_id: groupId, invited_user: userId, invited_by: invitedBy })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

export async function getMyInvites(userId) {
  const { data, error } = await supabase
    .from('group_invites')
    .select('id, group_id, status, created_at, group:groups!group_id(id, name, category), inviter:profiles!invited_by(name)')
    .eq('invited_user', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function respondToInvite({ inviteId, accept }) {
  const { error } = await supabase.rpc('respond_group_invite', {
    p_invite_id: inviteId,
    p_accept: accept,
  });
  if (error) throw error;
}

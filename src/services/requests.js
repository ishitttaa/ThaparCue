import { supabase } from '../lib/supabase';

const REQUEST_COLS = `
  id, from_user, to_user, message, status, created_at,
  sender:profiles!requests_from_user_fkey(id, name, branch),
  receiver:profiles!requests_to_user_fkey(id, name, branch)
`;

export async function getMyRequests(userId) {
  const { data, error } = await supabase
    .from('requests')
    .select(REQUEST_COLS)
    .or(`from_user.eq.${userId},to_user.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function respondToRequest({ requestId, userId, status }) {
  const { data, error } = await supabase
    .from('requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('to_user', userId)
    .eq('status', 'pending')
    .select('id, status')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This request was already answered.');
  return data;
}
export async function getChatRequest(requestId, userId) {
  const { data, error } = await supabase
    .from('requests')
    .select(REQUEST_COLS)
    .eq('id', requestId)
    .maybeSingle();

  if (error) {
    if (error.code === '22P02') return null; // URL mein galat id
    throw error;
  }

  const isMember = data && [data.from_user, data.to_user].includes(userId);
  return isMember && data.status === 'accepted' ? data : null;
}
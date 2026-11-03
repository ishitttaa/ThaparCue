import { supabase } from '../lib/supabase';

export async function getUnreadCounts() {
  const { data, error } = await supabase.rpc('get_unread_counts');
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((row) => [row.request_id, Number(row.unread)])
  );
}

export async function markChatRead(requestId) {
  const { error } = await supabase.rpc('mark_chat_read', { p_request_id: requestId });
  if (error) throw error;
}
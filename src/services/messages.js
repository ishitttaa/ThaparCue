import { supabase } from '../lib/supabase';

const MESSAGE_COLS = 'id, request_id, sender_id, content, created_at';

export async function getMessages(requestId) {
  const { data, error } = await supabase
    .from('messages')
    .select(MESSAGE_COLS)
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage({ requestId, senderId, content }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ request_id: requestId, sender_id: senderId, content })
    .select(MESSAGE_COLS)
    .single();
  if (error) throw error;
  return data;
}
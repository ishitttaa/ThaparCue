import { supabase } from '../lib/supabase';

export async function getMyRating(requestId, userId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('stars')
    .eq('request_id', requestId)
    .eq('rater_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.stars ?? null;
}

export async function rateHelper(requestId, stars) {
  const { error } = await supabase.rpc('rate_helper', {
    p_request_id: requestId,
    p_stars: stars,
  });
  if (error) throw error;
}
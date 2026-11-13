
import { supabase } from '../lib/supabase';

export async function getTotalUsers() {
  const { data, error } = await supabase.rpc('get_total_users');

  if (error) throw error;

  return Number(data);
}
  
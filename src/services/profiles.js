import { supabase } from '../lib/supabase';

const PROFILE_COLUMNS = 'id, name, branch, year, bio, created_at';

// Row na ho to null return hota hai (error nahi)
export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveMyProfile(userId, { name, branch, year }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        name: name.trim(),
        branch,
        year: Number(year),
      },
      { onConflict: 'id' }
    )
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}
const STUDENT_COLS = 'id, name, branch, year, bio';

export async function getOtherProfiles(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(STUDENT_COLS)
    .neq('id', userId)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select(STUDENT_COLS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    if (error.code === '22P02') return null; // URL mein galat id
    throw error;
  }
  return data;
}
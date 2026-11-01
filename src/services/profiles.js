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
const STUDENT_COLS =
  'id, name, branch, year, bio, profile_skills(level, skill:skills(name)), profile_custom_skills(name)';

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
export async function updateMyProfile(userId, { name, branch, year, bio }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: name.trim(),
      branch,
      year: Number(year),
      bio: bio.trim(),
    })
    .eq('id', userId)
    .select('id, name, branch, year, bio')
    .single();
  if (error) throw error;
  return data;
}
export async function getStudentsWithSkill(skillId, userId) {
  const { data: links, error: linkError } = await supabase
    .from('profile_skills')
    .select('profile_id')
    .eq('skill_id', skillId);
  if (linkError) throw linkError;

  const ids = (links ?? [])
    .map((row) => row.profile_id)
    .filter((id) => id !== userId)
    .slice(0, 100);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select(STUDENT_COLS)
    .in('id', ids)
    .order('name');
  if (error) throw error;
  return data ?? [];
}
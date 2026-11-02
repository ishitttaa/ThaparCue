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
export const STUDENT_COLS =
  'id, name, branch, year, bio, profile_skills(level, skill:skills(name)), profile_custom_skills(name, level), profile_courses(course_id)';

export async function attachStats(rows) {
  const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
  if (list.length === 0) return rows;
  const { data, error } = await supabase.rpc('get_profile_stats', {
    p_ids: list.map((r) => r.id).slice(0, 200),
  });
  if (error) throw error;
  const byId = new Map((data ?? []).map((s) => [s.profile_id, s]));
  const merged = list.map((r) => ({ ...r, stats: byId.get(r.id) ?? null }));
  return Array.isArray(rows) ? merged : merged[0];
}

export async function getOtherProfiles(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(STUDENT_COLS)
    .neq('id', userId)
    .order('name');
  if (error) throw error;
  return attachStats(data ?? []);
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
  return data ? attachStats(data) : data;
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
  return attachStats(data ?? []);
}
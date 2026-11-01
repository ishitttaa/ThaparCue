import { supabase } from '../lib/supabase';

export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('id, name, category, kind')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getMySkillIds(userId) {
  const { data, error } = await supabase
    .from('profile_skills')
    .select('skill_id')
    .eq('profile_id', userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.skill_id);
}

export async function addMySkill(userId, skillId) {
  const { error } = await supabase
    .from('profile_skills')
    .upsert(
      { profile_id: userId, skill_id: skillId },
      { onConflict: 'profile_id,skill_id', ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function removeMySkill(userId, skillId) {
  const { error } = await supabase
    .from('profile_skills')
    .delete()
    .eq('profile_id', userId)
    .eq('skill_id', skillId);
  if (error) throw error;
}

export async function getMyCustomSkills(userId) {
  const { data, error } = await supabase
    .from('profile_custom_skills')
    .select('id, name')
    .eq('profile_id', userId)
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function addMyCustomSkill(userId, rawName) {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const { data, error } = await supabase
    .from('profile_custom_skills')
    .insert({ profile_id: userId, name })
    .select('id, name')
    .single();
  if (error) {
    if (error.code === '23505') throw new Error('You already added this skill.');
    if (error.code === '23514') {
      throw new Error('Use 2 to 40 letters or numbers (you can also use . + # / & ( ) , -).');
    }
    throw error; // limit wala message seedha dikhega
  }
  return data;
}

export async function removeMyCustomSkill(userId, id) {
  const { error } = await supabase
    .from('profile_custom_skills')
    .delete()
    .eq('id', id)
    .eq('profile_id', userId);
  if (error) throw error;
}
export async function getSkillCounts() {
  const { data, error } = await supabase.rpc('skill_student_counts');
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((row) => [row.skill_id, Number(row.student_count)])
  );
}
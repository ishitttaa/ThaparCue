import { supabase } from '../lib/supabase';

const COURSE_COLS = 'id, code, name, year, groups';

export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(COURSE_COLS)
    .order('code');
  if (error) throw error;
  return data ?? [];
}

export async function getCourseByCode(code) {
  const { data, error } = await supabase
    .from('courses')
    .select(COURSE_COLS)
    .eq('code', code)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMyCourseIds(userId) {
  const { data, error } = await supabase
    .from('profile_courses')
    .select('course_id')
    .eq('profile_id', userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.course_id);
}

export async function addMyCourse(userId, courseId) {
  const { error } = await supabase
    .from('profile_courses')
    .upsert(
      { profile_id: userId, course_id: courseId },
      { onConflict: 'profile_id,course_id', ignoreDuplicates: true }
    );
  if (error) throw error;
}

export async function removeMyCourse(userId, courseId) {
  const { error } = await supabase
    .from('profile_courses')
    .delete()
    .eq('profile_id', userId)
    .eq('course_id', courseId);
  if (error) throw error;
}

export async function getCourseStudents(courseId) {
  const { data, error } = await supabase
    .from('profile_courses')
    .select('profile:profiles(id, name, branch, year, bio)')
    .eq('course_id', courseId);
  if (error) throw error;
  return (data ?? []).map((row) => row.profile).filter(Boolean);
}
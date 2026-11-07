import { supabase } from '../lib/supabase';

// ---------- Reviews (Part 2) ----------
export async function getReviewStats(courseId) {
  const { data, error } = await supabase.rpc('get_course_review_stats', { p_course_id: courseId });
  if (error) throw error;
  return data;
}

export async function getMyReview(courseId, userId) {
  const { data, error } = await supabase
    .from('course_reviews')
    .select('id, difficulty, workload, tags, taken_year, taken_semester')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveReview({ courseId, difficulty, workload, tags, takenYear, takenSemester }) {
  const { data, error } = await supabase.rpc('save_course_review', {
    p_course_id: courseId,
    p_difficulty: difficulty,
    p_workload: workload,
    p_tags: tags,
    p_taken_year: takenYear,
    p_taken_semester: takenSemester,
  });
  if (error) throw error;
  return data;
}

export async function deleteReview(id) {
  const { error } = await supabase.from('course_reviews').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Grade cutoffs (Part 3) ----------
export async function getGradeCutoffs(courseId) {
  const { data, error } = await supabase.rpc('get_course_grade_cutoffs', { p_course_id: courseId });
  if (error) throw error;
  return data ?? [];
}

export async function getMyCutoffs(courseId, userId) {
  const { data, error } = await supabase
    .from('grade_cutoffs')
    .select('id, taken_year, taken_semester, o_min, aplus_min, a_min, bplus_min, b_min, c_min')
    .eq('course_id', courseId)
    .eq('submitted_by', userId)
    .order('taken_year', { ascending: false })
    .order('taken_semester', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveCutoffs({ courseId, takenYear, takenSemester, values }) {
  const { data, error } = await supabase.rpc('save_grade_cutoffs', {
    p_course_id: courseId,
    p_taken_year: takenYear,
    p_taken_semester: takenSemester,
    p_o_min: values.o_min ?? null,
    p_aplus_min: values.aplus_min ?? null,
    p_a_min: values.a_min ?? null,
    p_bplus_min: values.bplus_min ?? null,
    p_b_min: values.b_min ?? null,
    p_c_min: values.c_min ?? null,
  });
  if (error) throw error;
  return data;
}

export async function deleteCutoff(id) {
  const { error } = await supabase.from('grade_cutoffs').delete().eq('id', id);
  if (error) throw error;
}

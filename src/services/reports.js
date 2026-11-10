import { supabase } from '../lib/supabase';

// Database ke enum report_reason ke exact values
export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Other' },
];
export const MAX_REPORT_DETAILS = 500;

// Database ke enum report_status ke exact values
export const REPORT_STATUSES = ['pending', 'actioned', 'dismissed'];

const VALID_REASONS = REPORT_REASONS.map((r) => r.value);

// ── User side ──────────────────────────────────────────────

// Sirf us chat ke participants report kar sakte hain (database enforce karta hai)
export async function reportConversation({ requestId, reason, details }) {
  if (!requestId) throw new Error('Missing conversation.');
  if (!VALID_REASONS.includes(reason)) throw new Error('Please choose a reason.');

  const cleaned = (details ?? '').trim();
  if (cleaned.length > MAX_REPORT_DETAILS) {
    throw new Error(`Details can be at most ${MAX_REPORT_DETAILS} characters.`);
  }

  const { data, error } = await supabase.rpc('report_conversation', {
    p_request_id: requestId,
    p_reason: reason,
    p_details: cleaned || null,
  });

  if (error) throw error;
  return data;
}

// Modal mein dikhane ke liye friendly message
export function reportErrorMessage(error) {
  switch (error?.code) {
    case '23505':
      return 'You have already reported this chat. A moderator will review it.';
    case '42501':
      return "You can't report this conversation.";
    default:
      return error?.message || 'Could not send the report. Please try again.';
  }
}

// Is chat par meri koi pending report hai? (reporter apni report dekh sakta hai)
export async function getMyPendingReport(requestId, userId) {
  const { data, error } = await supabase
    .from('reports')
    .select('id')
    .eq('request_id', requestId)
    .eq('reporter_id', userId)
    .eq('status', 'pending')
    .maybeSingle();

  if (error) throw error;
  return data; // null agar nahi hai
}

// ── Moderator side (database har jagah enforce karta hai) ──

export async function isModerator() {
  const { data, error } = await supabase.rpc('is_moderator');
  if (error) throw error;
  return data === true;
}

export async function listReports({ status = 'pending' } = {}) {
  if (!REPORT_STATUSES.includes(status)) throw new Error('Unknown report status.');

  const { data: reports, error } = await supabase
    .from('reports')
    .select(
      'id, reporter_id, reported_user_id, request_id, reason, details, status, created_at, moderated_by, moderated_at'
    )
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  if (!reports || reports.length === 0) return [];

  // Naam dikhane ke liye profiles alag se (FK embed par depend nahi karte)
  const ids = [...new Set(reports.flatMap((r) => [r.reporter_id, r.reported_user_id]))];
  const { data: people, error: peopleError } = await supabase
    .from('profiles')
    .select('id, name, branch, year')
    .in('id', ids);

  if (peopleError) throw peopleError;

  const byId = new Map((people ?? []).map((p) => [p.id, p]));
  return reports.map((r) => ({
    ...r,
    reporter: byId.get(r.reporter_id) ?? null,
    reported: byId.get(r.reported_user_id) ?? null,
  }));
}

// Moderator sirf REPORTED chats ke messages padh sakta hai (RLS policy)
export async function listReportedChatMessages(requestId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, content, created_at')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// action: 'dismiss' ya 'suspend'. reason optional (suspension reason).
export async function moderateReport({ reportId, action, reason }) {
  if (!['dismiss', 'suspend'].includes(action)) throw new Error('Unknown action.');

  const { error } = await supabase.rpc('moderate_report', {
    p_report_id: reportId,
    p_action: action,
    p_reason: (reason ?? '').trim() || null,
  });

  if (error) throw error;
}

export async function unsuspendUser(userId) {
  const { error } = await supabase.rpc('unsuspend_user', { p_user_id: userId });
  if (error) throw error;
}

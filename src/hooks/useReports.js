import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getMyPendingReport,
  isModerator,
  listReportedChatMessages,
  listReports,
  moderateReport,
  reportConversation,
  unsuspendUser,
} from '../services/reports';

// Route guard aur Navbar ke liye: kya ye user moderator hai?
export function useIsModerator() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['is-moderator', user?.id],
    queryFn: () => isModerator(),
    enabled: !!user?.id,
    staleTime: 5 * 60_000,
  });
}

// Chat mein: kya maine is chat ko pehle se report kiya hua hai (pending)?
export function useMyPendingReport(requestId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-pending-report', requestId, user?.id],
    queryFn: () => getMyPendingReport(requestId, user.id),
    enabled: !!requestId && !!user?.id,
  });
}

export function useReportConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportConversation, // { requestId, reason, details }
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-pending-report', variables.requestId] });
    },
  });
}

// ── Moderation page ──

export function useReports(status = 'pending') {
  const { data: moderator } = useIsModerator();
  return useQuery({
    queryKey: ['reports', status],
    queryFn: () => listReports({ status }),
    enabled: moderator === true,
  });
}

export function useReportedChat(requestId) {
  const { data: moderator } = useIsModerator();
  return useQuery({
    queryKey: ['reported-chat', requestId],
    queryFn: () => listReportedChatMessages(requestId),
    enabled: moderator === true && !!requestId,
  });
}

export function useModerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moderateReport, // { reportId, action, reason }
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsuspendUser, // userId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

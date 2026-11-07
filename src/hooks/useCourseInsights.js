import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  deleteCutoff,
  deleteReview,
  getGradeCutoffs,
  getMyCutoffs,
  getMyReview,
  getReviewStats,
  saveCutoffs,
  saveReview,
} from '../services/courseInsights';

// ---------- Reviews ----------
export function useReviewStats(courseId) {
  return useQuery({
    queryKey: ['review-stats', courseId],
    queryFn: () => getReviewStats(courseId),
    enabled: !!courseId,
  });
}

export function useMyReview(courseId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-review', courseId, user?.id],
    queryFn: () => getMyReview(courseId, user.id),
    enabled: !!courseId && !!user?.id,
  });
}

function useRefreshReviews(courseId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['review-stats', courseId] });
    queryClient.invalidateQueries({ queryKey: ['my-review', courseId, user?.id] });
  };
}

export function useSaveReview(courseId) {
  const refresh = useRefreshReviews(courseId);
  return useMutation({ mutationFn: saveReview, onSuccess: refresh });
}

export function useDeleteReview(courseId) {
  const refresh = useRefreshReviews(courseId);
  return useMutation({ mutationFn: deleteReview, onSuccess: refresh });
}

// ---------- Grade cutoffs ----------
export function useGradeCutoffs(courseId) {
  return useQuery({
    queryKey: ['grade-cutoffs', courseId],
    queryFn: () => getGradeCutoffs(courseId),
    enabled: !!courseId,
  });
}

export function useMyCutoffs(courseId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-cutoffs', courseId, user?.id],
    queryFn: () => getMyCutoffs(courseId, user.id),
    enabled: !!courseId && !!user?.id,
  });
}

function useRefreshCutoffs(courseId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['grade-cutoffs', courseId] });
    queryClient.invalidateQueries({ queryKey: ['my-cutoffs', courseId, user?.id] });
  };
}

export function useSaveCutoffs(courseId) {
  const refresh = useRefreshCutoffs(courseId);
  return useMutation({ mutationFn: saveCutoffs, onSuccess: refresh });
}

export function useDeleteCutoff(courseId) {
  const refresh = useRefreshCutoffs(courseId);
  return useMutation({ mutationFn: deleteCutoff, onSuccess: refresh });
}

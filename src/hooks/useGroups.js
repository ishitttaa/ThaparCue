import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  getGroups,
  getGroup,
  createGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupMessages,
  sendGroupMessage,
} from '../services/groups';

export function useGroups(category) {
  return useQuery({
    queryKey: ['groups', category],
    queryFn: () => getGroups({ category }),
    staleTime: 30_000,
  });
}

export function useGroup(id) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => createGroup({ ...vars, userId: user.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  });
}

export function useJoinGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId) => joinGroup(groupId, user.id),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useLeaveGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId) => leaveGroup(groupId, user.id),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useAddMemberToGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId, role }) => addMemberToGroup({ groupId, userId, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useRemoveMemberFromGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }) => removeMemberFromGroup({ groupId, userId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useGroupMessages(groupId, isMember) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['group-messages', groupId],
    queryFn: () => getGroupMessages(groupId),
    enabled: !!groupId && isMember,
    staleTime: 0,
  });

  useEffect(() => {
    if (!groupId || !isMember) return;
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${groupId}` },
        (payload) => {
          // Need to fetch sender info too
          supabase
            .from('group_messages')
            .select('id, group_id, sender_id, content, created_at, sender:profiles!sender_id(id, name, branch)')
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                queryClient.setQueryData(['group-messages', groupId], (old = []) =>
                  old.some((m) => m.id === data.id) ? old : [...old, data]
                );
              }
            });
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [groupId, isMember, queryClient]);

  return query;
}

export function useSendGroupMessage(groupId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => sendGroupMessage({ groupId, senderId: user.id, content }),
    onSuccess: (message) => {
      queryClient.setQueryData(['group-messages', groupId], (old = []) =>
        old.some((m) => m.id === message.id) ? old : [...old, message]
      );
    },
  });
}

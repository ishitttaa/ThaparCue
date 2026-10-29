import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getChatRequest } from '../services/requests';
import { getMessages, sendMessage } from '../services/messages';

const addMessage = (old = [], message) =>
  old.some((m) => m.id === message.id) ? old : [...old, message];

export function useChatRequest(requestId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['chat-request', requestId, user?.id],
    queryFn: () => getChatRequest(requestId, user.id),
    enabled: !!requestId && !!user?.id,
  });
}

export function useChatMessages(requestId, enabled) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', requestId],
    queryFn: () => getMessages(requestId),
    enabled: !!requestId && enabled,
    staleTime: 0,
  });

  useEffect(() => {
    if (!requestId || !enabled) return;

    const channel = supabase
      .channel(`chat-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          queryClient.setQueryData(['messages', requestId], (old) =>
            addMessage(old, payload.new)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, enabled, queryClient]);

  return query;
}

export function useSendMessage(requestId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) =>
      sendMessage({ requestId, senderId: user.id, content }),
    onSuccess: (message) => {
      queryClient.setQueryData(['messages', requestId], (old) =>
        addMessage(old, message)
      );
    },
  });
}
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useInboxRealtime(userId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['unread', userId] });
      queryClient.invalidateQueries({ queryKey: ['requests', userId] });
    };

    // Har instance ka alag naam, taaki Navbar mein do jagah lagne par bhi takraye nahi
    const channel = supabase
      .channel(`inbox-badge-${userId}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
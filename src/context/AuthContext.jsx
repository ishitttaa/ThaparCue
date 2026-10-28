import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { getMyProfile } from '../services/profiles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── 1. Session: Supabase hi token store/refresh karta hai, hum sirf sunte hain ──
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      // Callback ke andar sirf state set karo. Yahan await ya koi doosra
      // Supabase call mat daalo (deadlock ho sakta hai).
      setSession(newSession);
      setAuthLoading(false);

      if (event === 'SIGNED_OUT') {
        queryClient.clear(); // agle user ko purana cached data na dikhe
        setTimeout(() => supabase.removeAllChannels(), 0);
      }
    });

    // Purane supabase-js versions INITIAL_SESSION nahi bhejte, unke liye fallback
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error('Session restore error:', error.message);
      setSession((current) => current ?? data.session);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // ── 2. Profile: React Query se, cache ke saath ──
  const userId = session?.user?.id ?? null;
  const authEmail = session?.user?.email ?? null;

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getMyProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });

  const profile = profileQuery.data ?? null;
  const profileLoading = !!userId && profileQuery.isPending;
  const profileError = !!userId && profileQuery.isError && !profile;
  const { refetch: refetchProfile } = profileQuery;

  // ── 3. `user` ka shape purane code jaisa: { id, email, name, branch, year, bio, ... } ──
  const user = useMemo(
    () => (userId ? { id: userId, email: authEmail, ...(profile ?? {}) } : null),
    [userId, authEmail, profile]
  );

  const updateUser = useCallback(
    (updates) => {
      if (!userId) return;
      queryClient.setQueryData(['profile', userId], (previous) =>
        previous ? { ...previous, ...updates } : previous
      );
    },
    [queryClient, userId]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // cache clear + channels cleanup SIGNED_OUT event par ho jaata hai
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isAuthenticated: !!session,
        authLoading,
        profileLoading,
        profileError,
        refetchProfile,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

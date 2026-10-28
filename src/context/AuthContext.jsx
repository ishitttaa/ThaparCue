
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('email');
  const [pendingEmail, setPendingEmail] = useState('');
  
  
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  const loadUser = async () => {
    const { data: { session }, error } =
      await supabase.auth.getSession();

    if (!mounted) return;

    if (error) {
      console.error('Session restore error:', error.message);
    }

    
    if (session?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, branch, year, bio, created_at')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        console.error('Profile restore error:', profileError.message);
      } else if (profile) {
        setUser({
          ...profile,
          id: session.user.id,
          email: session.user.email,
        });
        setStep('dashboard');
      } else {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setStep('profile');
      }
    }


    if (mounted) setAuthLoading(false);
  };

  loadUser();

  
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    setUser(null);
    setPendingEmail('');
    setStep('email');
  } else if (event === 'SIGNED_IN' && session?.user) {
    // verifyOtp profile check karke step decide karega.
    setUser((previous) => ({
      ...previous,
      id: session.user.id,
      email: session.user.email,
    }));
  }

  setAuthLoading(false);
});


  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  const sendOtp = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    
    if (!/^[^\s@]+@thapar\.edu$/.test(normalizedEmail)) {
    throw new Error('Please use your Thapar college email (@thapar.edu).');
  }


    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) throw error;

    setPendingEmail(normalizedEmail);
    setStep('otp');
  };

  
const verifyOtp = async (otp) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email: pendingEmail,
    token: otp.trim(),
    type: 'email',
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error('Verification failed. Please try again.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, branch, year, bio, created_at')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  setUser({
    id: data.user.id,
    email: data.user.email,
    ...(profile || {}),
  });

  if (profile) {
    setStep('dashboard');
  } else {
    setStep('profile');
  }
};

  const completeRegistration = async (profileData) => {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!authUser) throw new Error('Please verify your email again.');

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          name: profileData.name.trim(),
          branch: profileData.branch,
          year: Number(profileData.year),
        },
        { onConflict: 'id' }
      )
      .select('id, name, branch, year, bio, created_at')
      .single();

    if (error) throw error;

    const newUser = {
      id: authUser.id,
      email: authUser.email,
      ...data,
    };

    setUser(newUser);
    setStep('dashboard');
    return newUser;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setPendingEmail('');
    setStep('email');
  };

  const updateUser = (updates) => {
    setUser((previous) =>
      previous ? { ...previous, ...updates } : previous
    );
  };

  const backToEmail = () => setStep('email');

  return (
    <AuthContext.Provider
      value={{
        user,
        step,
        pendingEmail,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        completeRegistration,
        logout,
        updateUser,
        backToEmail,
        authLoading,
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

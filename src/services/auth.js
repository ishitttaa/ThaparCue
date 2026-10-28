import { supabase } from '../lib/supabase';

const THAPAR_EMAIL = /^[^\s@]+@thapar\.edu$/;

// Email par 6-digit code bhejta hai. Normalized email return karta hai.
export async function requestOtp(email) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!THAPAR_EMAIL.test(normalizedEmail)) {
    throw new Error('Please use your Thapar college email (@thapar.edu).');
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: { shouldCreateUser: true },
  });

  if (error) throw error;
  return normalizedEmail;
}

// Code verify karta hai. Session ban jaane par AuthContext khud update ho jaata hai.
export async function confirmOtp(email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code.trim(),
    type: 'email',
  });

  if (error) throw error;
  if (!data.user) {
    throw new Error('Verification failed. Please try again.');
  }
  return data.user;
}

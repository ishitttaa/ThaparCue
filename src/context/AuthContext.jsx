import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock student data — simulates logged-in student
const MOCK_STUDENT = {
  id: 'stu-001',
  name: 'Ishita Rajput',
  email: 'ishita.rajput@thapar.edu',
  branch: 'Computer Science & Engineering',
  year: 3,
  reliabilityScore: 87,
  avatar: null,
  coursesTaken: ['CS301', 'CS302', 'CS201', 'MA101'],
  skills: ['Python', 'React', 'Machine Learning'],
  requestsSent: 4,
  requestsReceived: 0,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'profile'
  const [pendingEmail, setPendingEmail] = useState('');

  // Simulate sending OTP — always succeeds for @thapar.edu
  const sendOtp = (email) => {
    if (!email.endsWith('@thapar.edu')) {
      throw new Error('Please use your Thapar college email (@thapar.edu)');
    }
    setPendingEmail(email);
    setStep('otp');
    // The "OTP" is always 123456 in simulation
    return { mockOtp: '123456' };
  };

  // Verify OTP — accepts '123456'
  const verifyOtp = (otp) => {
    if (otp === '123456') {
      setStep('profile');
      return true;
    }
    throw new Error('Invalid OTP. Use 123456 for this demo.');
  };

  // Complete registration
  const completeRegistration = (profileData) => {
    const newUser = {
      ...MOCK_STUDENT,
      email: pendingEmail,
      name: profileData.name || MOCK_STUDENT.name,
      branch: profileData.branch || MOCK_STUDENT.branch,
      year: profileData.year || MOCK_STUDENT.year,
    };
    setUser(newUser);
    setStep('email');
    return newUser;
  };

  // Direct login (skip to logged-in state for demo)
  const demoLogin = () => {
    setUser(MOCK_STUDENT);
  };

  const logout = () => {
    setUser(null);
    setStep('email');
    setPendingEmail('');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      step,
      pendingEmail,
      isAuthenticated: !!user,
      sendOtp,
      verifyOtp,
      completeRegistration,
      demoLogin,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

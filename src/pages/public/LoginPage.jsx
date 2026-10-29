import { useState } from 'react';
import { requestOtp, confirmOtp } from '../../services/auth';
import AuthShell from '../../components/auth/AuthShell';

export default function LoginPage() {
  const [stage, setStage] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = await requestOtp(email);
      setEmail(normalizedEmail);
      setOtp('');
      setStage('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmOtp(email, otp);
      // Redirect yahan nahi karna: session bante hi PublicOnly guard
      // user ko /onboarding ya /dashboard bhej deta hai.
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setError('');
    setStage('email');
  };

  return (
    <AuthShell stepIndex={stage === 'email' ? 0 : 1} error={error}>
      {/* ── Email Step ── */}
      {stage === 'email' && (
        <form onSubmit={handleSendOtp} className="login-form">
          <h2 className="font-display login-form-title">Enter your college email</h2>
          <p className="text-secondary login-form-subtitle">
            Use your <code>@thapar.edu</code> email to get started
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">College Email</label>
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="you@thapar.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Send OTP'}
          </button>
        </form>
      )}

      {/* ── OTP Step ── */}
      {stage === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="login-form">
          <h2 className="font-display login-form-title">Verify your email</h2>
          <div className="login-hint">
            📬 Check your Thapar email for the verification code.
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="otp-input">One-Time Password</label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="form-input otp-input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading || otp.length < 6}>
            {loading ? <span className="spinner" /> : 'Verify OTP'}
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full"
            style={{ marginTop: 'var(--space-2)' }}
            onClick={handleBackToEmail}
          >
            ← Back to email
          </button>
        </form>
      )}
    </AuthShell>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

export default function LoginPage() {
 const {
  step,
  sendOtp,
  verifyOtp,
  completeRegistration,
  backToEmail
  } = useAuth();
 const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpHint, setShowOtpHint] = useState(false);

  
const handleSendOtp = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await sendOtp(email);
    setShowOtpHint(true);
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
    await verifyOtp(otp);
  } catch (err) {
    setError(err.message || 'Invalid OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};


  
const handleComplete = async (e) => {
  e.preventDefault();
  setError('');

  if (!name.trim()) {
    setError('Please enter your name.');
    return;
  }

  if (!branch) {
    setError('Please select your branch.');
    return;
  }

  if (!year) {
    setError('Please select your year.');
    return;
  }

  setLoading(true);

  try {
    await completeRegistration({
      name,
      branch,
      year: Number(year),
    });

    navigate('/dashboard');
  } catch (err) {
    setError(err.message || 'Could not save your profile.');
  } finally {
    setLoading(false);
  }
};

  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  return (
    <div className="login-page">
      <div className="glow-orb glow-orb-primary" style={{ width: 400, height: 400, top: -80, left: -120 }} />
      <div className="glow-orb glow-orb-violet" style={{ width: 350, height: 350, bottom: -80, right: -100 }} />

      <div className="login-container">
        {/* Logo */}
        <Link to="/" className="login-logo">
          <span>⚡</span>
          <span className="font-display">Thapar <span className="text-gradient">SkillLink</span></span>
        </Link>

        {/* Step indicator */}
        <div className="login-steps">
          {['Email', 'Verify', 'Profile'].map((s, i) => (
            <div key={s} className="login-step-item">
              <div className={`login-step-dot ${i <= stepIndex ? 'active' : ''}`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`login-step-label ${i === stepIndex ? 'text-primary' : 'text-muted'}`}>{s}</span>
              {i < 2 && <div className={`login-step-connector ${i < stepIndex ? 'filled' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="login-card glass-card">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* ── Email Step ── */}
          {step === 'email' && (
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
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <h2 className="font-display login-form-title">Verify your email</h2>
              {showOtpHint && (
                <div className="login-hint">
                  📬 Check your Thapar email for the verification code.
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="otp-input">One-Time Password</label>
                <input
                  id="otp-input"
                  type="text"
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
                onClick={() => {
                  setError('');
                  backToEmail();
                }}
              >
                ← Back to email
              </button>
            </form>
          )}

          {/* ── Profile Step ── */}
          {step === 'profile' && (
            <form onSubmit={handleComplete} className="login-form">
              <h2 className="font-display login-form-title">Complete your profile</h2>
              <p className="text-secondary login-form-subtitle">Help seniors match with you better</p>
              <div className="form-group">
                <label className="form-label" htmlFor="name-input">Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  className="form-input"
                  placeholder="Ishita Rajput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="branch-select">Branch</label>
                <select
                  id="branch-select"
                  className="form-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="">Select branch…</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="year-select">Current Year</label>
                <select
                  id="year-select"
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="">Select year…</option>
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Profile & Enter'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

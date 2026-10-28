import { Link } from 'react-router-dom';

const STEPS = ['Email', 'Verify', 'Profile'];

// Login aur Onboarding dono ka common layout (logo + stepper + card)
export default function AuthShell({ stepIndex, error, children }) {
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
          {STEPS.map((s, i) => (
            <div key={s} className="login-step-item">
              <div className={`login-step-dot ${i <= stepIndex ? 'active' : ''}`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`login-step-label ${i === stepIndex ? 'text-primary' : 'text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`login-step-connector ${i < stepIndex ? 'filled' : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className="login-card glass-card">
          {error && <div className="login-error">{error}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

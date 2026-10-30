import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Course-Locked Guidance',
    desc: 'Find seniors who have actually taken your exact course — not random advice from strangers.',
  },
  {
    icon: '⭐',
    title: 'Verified Reliability Scores',
    desc: 'Every senior has a reliability score based on response rate, helpfulness, and past feedback.',
  },
  {
    icon: '💬',
    title: 'Structured Topic Threads',
    desc: 'Requests are categorised by topic — exam strategy, skill guidance, placement prep, and more.',
  },
];

const STEPS = [
  { num: '01', title: 'Search your course or skill', desc: 'Find seniors with verified experience in exactly what you need.' },
  { num: '02', title: 'Send a topic-locked request', desc: 'Choose a topic, add context, and send a structured request in seconds.' },
  { num: '03', title: 'Get real, experienced guidance', desc: 'Chat one-on-one and rate the interaction to help the community.' },
];

const STATS = [
  { val: '15+', label: 'Verified Seniors' },
  { val: '8', label: 'Core Courses' },
  { val: '20+', label: 'Skills Covered' },
  { val: '200+', label: 'Interactions' },
];

export default function LandingPage() {
  const { demoLogin } = useAuth();

  return (
    <div className="landing-page">
      {/* Decorative orbs */}
      <div className="glow-orb glow-orb-primary" style={{ width: 500, height: 500, top: -100, left: -150 }} />
      <div className="glow-orb glow-orb-violet" style={{ width: 400, height: 400, top: 200, right: -100 }} />

      {/* ── HERO ── */}
      <section className="landing-hero container">
        <div className="landing-hero-content anim-fade-up">
          <span className="section-label" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            Thapar University · Peer Knowledge
          </span>
          <h1 className="landing-title font-display">
            Learn from seniors who've<br />
            <span className="text-gradient">been exactly where you are</span>
          </h1>
          <p className="landing-subtitle text-secondary">
            Thapar SkillLink connects you with verified seniors who've taken your courses,
            earned the grades, and landed the placements — so you get real guidance, not guesses.
          </p>
          <div className="landing-ctas">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started — It's Free
            </Link>
            <button
              className="btn btn-secondary btn-lg"
              onClick={demoLogin}
            >
              Try Demo Login
            </button>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
            Use your @thapar.edu email — or click demo to explore instantly
          </p>
        </div>

        {/* Hero visual */}
        <div className="landing-hero-visual anim-float">
          <div className="hero-card glass-card">
            <div className="hero-card-row">
              <div className="avatar-placeholder avatar-md" style={{ background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))', fontSize: '0.85rem' }}>RM</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Roopanshi Marwaha · CSE Y3</p>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>System Design · OS · DSA</p>
              </div>
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>94 score</span>
            </div>
            <div className="hero-card-msg">
              <div className="hero-msg hero-msg-them">
                "For OS MST, deadlock and scheduling algorithms carry 40% weight. Don't skip the numerical problems."
              </div>
              <div className="hero-msg hero-msg-you">
                Got it! Which scheduling algo appears most often?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="landing-stats-strip">
        <div className="container landing-stats">
          {STATS.map((s) => (
            <div key={s.label} className="landing-stat">
              <span className="landing-stat-val font-display">{s.val}</span>
              <span className="landing-stat-label text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features container">
        <div className="landing-section-header">
          <span className="section-label">Why SkillLink</span>
          <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginTop: 'var(--space-3)' }}>
            Structured guidance that actually helps
          </h2>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature-card glass-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="font-display" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                {f.title}
              </h3>
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-steps container">
        <div className="landing-section-header">
          <span className="section-label">How it works</span>
          <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginTop: 'var(--space-3)' }}>
            Three steps to real guidance
          </h2>
        </div>
        <div className="landing-steps-list">
          {STEPS.map((step, i) => (
            <div key={step.num} className="landing-step">
              <div className="landing-step-num font-display">{step.num}</div>
              {i < STEPS.length - 1 && <div className="landing-step-line" />}
              <div className="landing-step-content">
                <h3 className="font-display" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  {step.title}
                </h3>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="landing-cta-band">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
            Ready to find your mentor senior?
          </h2>
          <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
            Join hundreds of Thapar students already getting structured guidance.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
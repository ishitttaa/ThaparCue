import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useLandingAnimations from '../../hooks/useLandingAnimations';
import useSpotlight from '../../hooks/useSpotlight';
import HeroChatDemo from '../../components/HeroChatDemo';

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

// Headline ko words mein todta hai, har word neeche se slide hoke aata hai
function Words({ text, start = 0, className = '' }) {
  return text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="word" style={{ '--i': start + i }}>
        <span className={className}>{word}</span>
      </span>{' '}
    </span>
  ));
}

export default function LandingPage() {
  const root = useLandingAnimations();
  useSpotlight();

  return (
    <div className="landing-page" ref={root}>
      {/* Decorative orbs */}
      <div className="glow-orb glow-orb-primary" style={{ width: 500, height: 500, top: -100, left: -150 }} />
      <div className="glow-orb glow-orb-violet" style={{ width: 400, height: 400, top: 200, right: -100 }} />

      {/* ── HERO ── */}
      <section className="landing-hero container">
        <div className="landing-hero-content">
          <span className="section-label" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            Thapar University · Peer Knowledge
          </span>
          <h1 className="landing-title font-display">
            <Words text="Learn from seniors who've" />
            <br />
            <Words text="been exactly where you are" start={4} className="hero-shimmer" />
          </h1>
          <p className="landing-subtitle text-secondary">
            ThaparCue connects you with verified seniors who've taken your courses,
            earned the grades, and landed the placements. So, you get real guidance, not guesses.
          </p>
          <div className="landing-ctas">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
            Use your @thapar.edu email to get started.
          </p>
        </div>

        {/* Hero visual */}
        <div className="landing-hero-visual">
          <HeroChatDemo />
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
          <span className="section-label">Why ThaparCue</span>
          <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginTop: 'var(--space-3)' }}>
            Structured guidance that actually helps
          </h2>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature-card glass-card spot">
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
            <div key={step.num} className="landing-step spot">
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
          <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)' }}>
            Ready to find your mentor senior?
          </h2>
          <p className="text-secondary">
            Join hundreds of Thapar students already getting structured guidance.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>

          <div className="cta-credit">
            <span className="cta-credit-brand font-display">⚡ Thapar <b>Cue</b></span>
            <span className="cta-credit-names">
              Built with ♥ by Roopanshi Marwaha, Tripti Bansal &amp; Ishita Rajput
            </span>
            <span className="cta-credit-uni">
              Thapar Institute of Engineering &amp; Technology
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
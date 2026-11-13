import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import './HeroChatDemo.css';

// from: 'you' = input bar mein type hoke send hota hai, 'them' = senior ka reply (typing dots ke baad)
const SCRIPT = [
  { from: 'you',  text: 'Hey! What should I focus on for the OS MST?' },
  { from: 'them', text: "Deadlock and scheduling algorithms carry 40% weight. Don't skip the numerical problems." },
  { from: 'you',  text: 'Got it! Which scheduling algo appears most often?' },
  { from: 'them', text: 'Round Robin and SJF, almost every year. Practice Gantt charts 💪' },
];

const TYPE_MS = 32;     // har letter ke beech
const REPLY_MS = 1300;  // senior ke "typing..." dots kitni der
const PAUSE_MS = 650;   // messages ke beech
const LOOP_MS = 3800;   // poori baat ke baad ruk ke dobara shuru

export default function HeroChatDemo() {
  const [shown, setShown] = useState([]);
  const [draft, setDraft] = useState('');
  const [dots, setDots] = useState(false);

  useEffect(() => {
    // Motion pasand nahi to seedha poori chat dikha do
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(SCRIPT);
      return undefined;
    }

    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)));

    (async () => {
      while (!cancelled) {
        setShown([]);
        setDraft('');
        setDots(false);
        await wait(800);

        for (const m of SCRIPT) {
          if (cancelled) return;

          if (m.from === 'you') {
            for (let i = 1; i <= m.text.length; i += 1) {
              if (cancelled) return;
              setDraft(m.text.slice(0, i));
              await wait(TYPE_MS);
            }
            await wait(350);
            if (cancelled) return;
            setDraft('');
            setShown((s) => [...s, m]);
          } else {
            setDots(true);
            await wait(REPLY_MS);
            if (cancelled) return;
            setDots(false);
            setShown((s) => [...s, m]);
          }
          await wait(PAUSE_MS);
        }

        await wait(LOOP_MS);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="hero-card glass-card spot hc-card" aria-hidden="true">
      <div className="hero-card-row">
        <div className="avatar-placeholder avatar-md" style={{ fontSize: '0.85rem' }}>SG</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Stuti Gupta · COE 3rd Year</p>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>System Design · OS · DSA</p>
        </div>
        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>94 score</span>
      </div>

      <div className="hc-msgs">
        {shown.map((m, i) => (
          <div key={i} className={`hero-msg ${m.from === 'you' ? 'hero-msg-you' : 'hero-msg-them'}`}>
            {m.text}
          </div>
        ))}
        {dots && (
          <div className="hero-msg hero-msg-them hc-typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      <div className="hc-input">
        <div className={`hc-draft ${draft ? 'hc-caret' : 'hc-placeholder'}`}>
          {draft || 'Type a message...'}
        </div>
        <span className="hc-send"><Send size={15} /></span>
      </div>
    </div>
  );
}
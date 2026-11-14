# 🎓 ThaparCue

### Find someone who has already been where you are.

🔗 **Live Demo:** [thapar-cue.vercel.app](https://thapar-cue.vercel.app)

ThaparCue is a campus knowledge sharing and peer guidance platform built exclusively for Thapar students. It connects students with relevant peers and seniors based on courses, skills, academic experience, and a transparent weighted matching algorithm.

Students can discover mentors, request guidance, chat in real time, and share their experiences — all in one place.

> **Note:** Login is restricted to `@thapar.edu` email accounts, so the live demo can only be accessed by Thapar students.

---

## ✨ Features

- **College-Verified Authentication:** Secure email OTP login restricted to `@thapar.edu`.
- **Smart Senior Matching:** Weighted Match Score based on course overlap, recency, academic context, reliability, and response rate.
- **Course Explorer:** Browse 661 courses across 18 branches, view course details, and discover matched seniors.
- **Skills Explorer:** Explore 505 curated skills and find students with relevant expertise.
- **Topic-Locked Requests:** Send structured guidance requests linked to specific topics and courses.
- **Real-Time Chat:** Communicate with seniors once requests are accepted.
- **Ratings & Reputation:** Build trust through conversation ratings and reliability metrics.
- **Safety & Moderation:** Database-level reporting, suspension, and moderator authorization.
- **Polished UI:** Thapar-inspired maroon and gold theme, smooth scrolling, scroll reveal animations, skeleton loaders, and toast notifications.

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React + Vite | Frontend |
| React Router DOM | Routing |
| TanStack Query v5 | Server state management |
| Supabase Auth | Authentication |
| PostgreSQL | Database |
| Supabase RLS | Database security |
| Supabase Realtime | Live messaging |
| GSAP | Scroll and interaction animations |
| Lenis | Smooth scrolling |
| Sonner | Toast notifications |
| JavaScript + CSS | Application logic and styling |

**Architecture:** Supabase serves as the backend, providing authentication, database operations, security, and real-time functionality. No separate backend server is used.

## 🧠 Match Score

Students are ranked using five weighted parameters:

| Parameter | Weight |
|---|---:|
| Course Match | 30% |
| Recency | 10% |
| Academic Context | 15% |
| Reliability | 30% |
| Response Rate | 15% |

Missing parameters are excluded and the remaining weights are normalized.

## 🚀 Getting Started

**Prerequisites:** Node.js, npm, and a Supabase project.

1. Clone the repository:

```bash
git clone https://github.com/ishitttaa/ThaparCue.git
cd ThaparCue
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

> **Windows PowerShell:** if you see a "scripts is disabled" error, use `npm.cmd` instead of `npm` (for example `npm.cmd install` and `npm.cmd run dev`).

**Note:** Never expose or commit your Supabase service role key. Keep `.env.local` private; it is already listed in `.gitignore`.

## 📁 Project Structure

```text
src/
├── components/   Reusable UI (cards, modal, layout, auth shell)
├── pages/        Public pages and logged-in app pages
├── hooks/        Data and animation hooks
├── services/     Supabase queries
├── context/      Auth state
├── routes/       Route definitions and guards
├── lib/          Supabase client, match score, helpers
├── theme.css     Maroon and gold theme
└── morphism.css  Glass and clay effects, background
```

## 🔒 Security

- Row Level Security (RLS) enabled across database tables.
- College email restrictions enforced server-side.
- Secure SQL functions for sensitive operations.
- Participant only access to accepted conversations.
- Database enforced suspension and moderation policies.

## 🗺️ Roadmap

- [ ] Structured course reviews and student experiences.
- [ ] Grade cutoff insights across batches.
- [ ] Report and moderation interface.
- [ ] "Why this match?" score breakdown.
- [ ] Alumni badges.
- [ ] Platform analytics dashboard.
- [ ] Automated testing with Vitest.
- [ ] Production deployment.

## 👩‍💻 Contributors

- **Ishita Rajput**
- **Tripti**
- **Roopanshi Marwaha**

---

<p align="center">
  Built with ❤️ for the Thapar community.
</p>

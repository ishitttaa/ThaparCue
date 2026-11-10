Thapar SkillLink (ThaparCue)

"Find someone who has already been where you are."

A campus knowledge and peer-guidance web app for Thapar students. Students browse courses and skills, find the most relevant verified peers/seniors, send a topic-locked request, chat in real time once it is accepted, and rate the conversation. A transparent weighted Match Score ranks who to ask.

Repo: github.com/ishitttaa/ThaparCue
Stack: React (Vite, JSX) + react-router-dom + TanStack Query v5 + Supabase (Auth with email OTP, Postgres, Row Level Security, Realtime, SQL functions). There is no separate backend server; Supabase is the backend.
Environment: Windows, PowerShell. Use npm.cmd (plain npm is blocked by the execution policy).
Handoff notes for another AI assistant

Read this section first.

The owner is a beginner. Give step-by-step instructions, one small step at a time, with exact file paths and full-file replacements where possible. The owner writes in Hinglish (Hindi in Roman script mixed with English), so replying in the same style works well.
Every JSX file must end in .jsx (a .js file containing JSX fails in Vite). Watch similar names: SkillCard.jsx (one card in the Skills tab) vs SkillsCard.jsx (the "Skills" box on the profile page).
Rule: only src/services/ talks to Supabase (supabase.from(...) / .rpc(...)). Pages and components use hooks.
Never use the service_role key anywhere in the frontend. Only the publishable key is in .env.local (VITE_ variables are public in the bundle).
Security lives in the database (RLS + SQL functions), not in the UI. Route guards are UX only.
Before suggesting data (course codes, schemes), do not trust unsourced lists. Several AI-generated course lists contained wrong codes (for example swapping UCS414, UCS415, UCS503). Use official thapar.edu scheme PDFs or screenshots the owner provides.
When changing git history or deleting data, warn first. Never run delete from public.courses (it cascades to students' selected courses). Use upserts.
Run git status and git branch before giving merge advice; branches were sometimes committed to the wrong branch.
Never give SQL with placeholders (A_ID, B_ID): they caused errors before. Tests must pick or create their own data.
Test every SQL on a scratch Postgres before handing it over, and also run a negative check (break a policy on purpose, confirm the test fails). An AI-written reports script once had using errstate = ... (invalid; the option is errcode), so moderate_report could not even be created, plus a unique (request_id, status) constraint that blocked a second dismissed/actioned report on the same chat.
The React side must follow the same rule as everything else: no supabase.rpc inside a component, no prompt()/alert(). Use src/services/reports.js + a hook + a small modal.
Features built (working end to end)
Area	What works
Auth	Email OTP login, only @thapar.edu, enforced in the browser and server-side (Supabase "Before User Created" hook function hook_only_thapar_signups). OTP expiry set to 600 s. Session survives refresh; guards redirect correctly; logout clears the React Query cache and realtime channels and signs out all devices (default scope).
Onboarding / Profile	Name, branch (18 official branches), year, bio (300 chars). Edit profile. "My reputation" card.
Courses	661 official courses with groups (branches that take them) and year. Courses tab filters by branch/year/search. Course detail page by code (/course/UCS414): course info card, "I've taken this course", Top 3 matched students (show all), request modal prefilled with the course.
Courses taken	Searchable picker modal (branch + year filter) on the profile; saved to profile_courses.
Skills	505 curated skills (technical + soft, with categories) plus per-student custom skills (max 10) and levels (Beginner to Expert, Expert shows a star). Skills tab: search, category, "only skills with students", detail panel listing students (ranked by match score then level), "I have this skill".
Explore / Senior profile	Real students, search by name/branch/bio/skill, branch filter, sort by Best match / Name / Year. Cards show rating, response rate, reliability, "% match", skills.
Requests (topic-locked)	Topic (required), related course (optional, search), message 20+ chars. No duplicate pending/accepted request to the same person. Message is stored as Topic: ...\n\nCourse ID: CODE\n\n<text>.
Inbox	Tabs (all/pending/accepted/rejected), accept/reject by receiver only, "Open Chat".
Chat	Real-time messages (Supabase Realtime), only for accepted requests, only participants.
Ratings	After accept, both participants can rate the conversation 1-5 stars once both have sent at least one message. Ratings are private to the rater; only aggregates show.
Reliability + Match Score	See formulas below.
Unread badge	chat_reads + get_unread_counts() + realtime refresh; badge on the Inbox link in the Navbar and "N new" on chat cards. (Verify the Navbar wiring and that requests is in the supabase_realtime publication.)
Dashboard	Real stats, recommended students (match score), recent requests, suggested courses for the user's branch/year.
Safety (database side only)	Moderators, suspensions, reports and the secure functions exist and are SQL-tested (see Safety design). No UI yet: no Report button, no /moderation page, no "Was this appropriate?".
Match Score (in src/lib/matchScore.js)

score = 0.30*Course + 0.10*Recency + 0.15*Context + 0.30*Reliability + 0.15*ResponseRate

Course: overlap between the candidate's taken courses and the viewer's target courses (the course page's course, else the viewer's branch courses for this and next year not yet taken); 3+ overlapping courses = full marks; ignored if no targets.
Recency: 0.5 ^ (days since last activity / 30).
Context: 0.6 * same branch + 0.4 * seniority (seniority: higher year 1, same year 0.5, lower 0.1).
Missing parts are skipped and the remaining weights renormalised. Weights live in one place (WEIGHTS).
Reliability (SQL function get_profile_stats(uuid[]))

reliability = 100 * (0.5 * smoothed rating + 0.3 * response rate + 0.2 * course consistency)

Smoothed rating: (n*avg + 3*3.5)/(n+3) normalised to 0-1, so one 5-star rating does not dominate.
Response rate: accepted/rejected requests divided by eligible received requests (pending older than 3 days counts as eligible).
Course consistency: share of received requests that named a Course ID the student has actually taken.
Neutral 0.5 when there is no data; cards show "New" until there is some history.
Project structure
src/
  main.jsx, App.jsx
  routes/        AppRoutes.jsx, guards.jsx  (RequireAuth, RequireProfile, RequireNoProfile, PublicOnly)
  context/       AuthContext.jsx   (session + profile via React Query, logout)
  lib/           supabase.js, queryClient.js, branches.js (18 branches), topics.js (TOPIC_OPTIONS),
                 students.js (toStudent), matchScore.js, skillLevels.js, courseInfo.js
  services/      auth.js, profiles.js, requests.js, messages.js, courses.js, skills.js, ratings.js, unread.js
  hooks/         useMyProfile, useUpdateProfile, useProfiles, useRequests, useChat, useCourses,
                 useSkills, useRatings, useMatchContext, useUnread, useInboxRealtime
  components/    layout/Navbar, auth/AuthShell, SeniorCard, RequestCard, RequestModal, CourseListCard,
                 CoursePickerModal, CoursesTakenCard, CourseSelect, CourseInfoCard, SkillCard,
                 SkillPickerModal, SkillsCard, StarRating, RateHelper, StudentStats,
                 ReputationCard, InboxBadge
  pages/public/  LandingPage, LoginPage
  pages/app/     OnboardingPage, DashboardPage, ExplorePage, SeniorProfilePage, CoursesPage,
                 CourseDetailPage, SkillsPage, InboxPage, ChatPage, ProfilePage

Routes: /, /login, /onboarding, /dashboard, /explore, /senior/:id, /courses, /course/:code, /skills, /inbox, /inbox/:id (chat for request id), /profile.

React Query keys in use: ['profile', uid], ['students', uid], ['student', id], ['courses'], ['course', code], ['my-course-ids', uid], ['course-students', courseId], ['skills'], ['my-skills', uid], ['my-custom-skills', uid], ['skill-counts'], ['skill-students', skillId], ['requests', uid], ['messages', requestId], ['chat-request', requestId, uid], ['my-rating', requestId], ['unread', uid].

src/data/ (mock files) should be gone; verify nothing imports mockCourses, mockSeniors, mockSkills or mockInteractions.

Database (Supabase Postgres)

All tables have RLS enabled. Keep a copy of every SQL run in supabase-notes.sql.

Table	Purpose / key rules
profiles	id = auth user id; name, branch, year, bio. Any logged-in user can read; users create/update only their own row. Bio length check (<= 300).
requests	from_user, to_user, message, status (pending/accepted/rejected), timestamps. Insert only as self, only pending, not to self. Select only own. Receiver can update only status and updated_at (column grants) and only while pending.
messages	Insert/select only by participants of an accepted request; sender must be self. No update/delete.
courses	code unique, name, year (1-4), groups text[] (branch names), plus credits, l, t, p, assessment, prerequisites (nullable). Read-only for users.
skills	name (unique case-insensitive), category, kind (technical/soft). Read-only for users.
profile_courses, profile_skills (with level), profile_custom_skills (with level)	Everyone logged in can read; users insert/delete only their own rows; only level can be updated. Triggers cap 30 listed and 10 custom skills per student.
ratings	PK (request_id, rater_id). Select only own ratings; writes only through rate_conversation().
chat_reads	Per user per chat last_read_at for unread counts.
moderators	user_id only. RLS on, no client access at all (all privileges revoked). Rows are added manually in the SQL Editor (Step B).
suspensions	user_id (PK), reason, suspended_by, created_at. RLS on, no client access. Read only through is_suspended().
reports	reporter_id, reported_user_id, request_id, reason (enum spam/harassment/inappropriate/other), details (<= 500), status (pending/actioned/dismissed), moderated_by/at. Clients can only select (reporter sees own, moderator sees all). Writes only via functions. One pending report per reporter per chat (partial unique index).

SQL functions: hook_only_thapar_signups(event jsonb) (Auth hook, grants to supabase_auth_admin), skill_student_counts(), get_profile_stats(uuid[]) (<= 200 ids per call), rate_conversation(uuid, int) (security definer), get_unread_counts(), mark_chat_read(uuid), trigger function limit_profile_skills(), is_moderator(), is_suspended(uuid), report_conversation(uuid, report_reason, text), moderate_report(uuid, text, text) (action dismiss or suspend), unsuspend_user(uuid). The last three are security definer, search_path = '', executable only by authenticated.

Realtime is used on messages (INSERT, filtered by request_id) and requests; make sure both tables are in the supabase_realtime publication.

Safety design (database side, done and tested)
Suspension lives in its own table, not a profiles column, so a user can never un-suspend themselves through their own-row update policy. Restrictive RLS policies block a suspended user from inserting requests, inserting messages and responding to requests (all three tested: PASS).
Not verified / not done: hiding suspended users from Explore; reading is not blocked for suspended users.
Reporting: only a participant of an accepted chat can report it; the other participant becomes reported_user_id automatically. Outsiders, pending chats and anonymous calls are rejected.
Moderator powers: read all reports; read messages only of chats that have a report (policy Moderators can read reported chats on messages); dismiss or suspend; unsuspend. A moderator cannot suspend another moderator. A processed report cannot be processed again.
Dismiss sets status dismissed; suspend sets actioned and inserts into suspensions. After a report is closed the same person can report that chat again.
Not built yet: rate limit on reports, notifying the reported user, auto-suspend after N reports.

SQL files (keep them in supabase-notes.sql): Step A (suspensions + restrictive policies), Step B (insert yourself into moderators), Step C = step-c-reports.sql.

Security checklist (re-run after adding any table)
sql
select relname, relrowsecurity from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r' order by relname;

Every table must show true. Also check that the safety functions are not callable by anon:

sql
select proname, has_function_privilege('anon', oid, 'execute') as anon_can_run
from pg_proc where pronamespace = 'public'::regnamespace
  and proname in ('report_conversation','moderate_report','unsuspend_user');

All three must show false. Never leave temporary import tables behind (courses_import, skills_import, course_details_import); each must be created with RLS enabled and dropped after use.

Data
Branches (exact 18 names, src/lib/branches.js): Computer Science & Engineering; Computer Science & Business Systems; Computer Engineering; Artificial Intelligence & Data Science; Robotics & Artificial Intelligence; Electronics & Communication Engineering; Electronics & Computer Engineering; Electronics Engineering(VLSI Design and Technology); Electronics (Instrumentation & Control) Engineering; Electrical Engineering; Electrical & Computer Engineering; Mechanical Engineering; Mechatronics Engineering; Civil Engineering; Civil Engineering with Computer Applications; Chemical Engineering; Biotechnology; Biomedical Engineering.
Courses (661): courses_v6.csv. Imported with a staging table + upsert (on conflict (code) do update set name, year, groups). Sources: official thapar.edu scheme PDFs (CSE 2024, COE 2025-26, AI&DS, EE, EIC, EEC, BME, CCA, Civil, ...) and scheme tables/screenshots supplied by the owner (CSBS, Mechatronics, Mechanical, RAI 2025). Some schemes are older (ECE, ENC, Chemical). Both old (UCH001, UMA010...) and 2024+ (UCB009, UMA022...) first-year codes exist.
Different codes for the same course name across branches is normal (e.g. Operating Systems is UCS303, UCT401, URA415...). Each code is its own row.
Course details: course_details.csv has credits and L-T-P for 149 CSBS + RAI courses. Other branches show "Not available yet". Workload label is derived only from weekly class hours (L+T+P): <= 4 Light, 5-6 Moderate, >= 7 Heavy. It is not a difficulty rating.
Skills (505): skills.csv, deduplicated from two owner-supplied lists.
Not imported yet: courses_unverified.csv (VLSI courses taken from an unsourced text; verify with a VLSI student first) and courses_needs_review.csv (codes with conflicting names).
Known data gaps: VLSI upper-year courses unverified; credits/L-T-P for CSE and most other branches; Mechatronics elective baskets 7 and 8; assessment and prerequisites for all courses; elective years are approximated from the basket (screenshots did not say which semester).
Setup
npm.cmd install
Copy .env.example to .env.local and fill in VITE_SUPABASE_URL and the Supabase publishable key variable (same names as in the existing .env.local).
npm.cmd run dev, npm.cmd run build.
Never commit .env.local (*.local is in .gitignore).

Git notes: set git config user.email to a real address (some early commits used the placeholder your-email@example.com, which GitHub cannot link to an account). Work on branches; merge into main after testing; do not rewrite history once a collaborator has cloned.

Pitch vs current status

Pitch components: (1) Course Decision Assistant (hero), (2) Smart Senior Matching, (3) Topic-Locked Ask-a-Senior, (4) Skill Search, plus Safety.

Pitch item	Status
Login with college email OTP	Done
Smart Senior Matching (w1..w5)	Done
Topic-locked requests	Done
Skill Search	Done
Course Decision Assistant	Partial: course info, top 3 matched students, request prefill done (Part 1). Missing: structured student experience (Part 2), year/semester-tagged grade cuts (Part 3)
Report/flag, suspension, moderator	Partial: database + secure functions done and tested. Missing: Report button in chat, /moderation page, "Was this appropriate?" on rating
Alumni badge	Not built (isAlumni is always false)
"Why this match" explanation	Not built
Success metrics view (requests, accept rate, rated)	Not built
Automated tests	Not built (all testing so far is manual: integration, system, negative, regression, SQL-based RLS tests)
What to do next (after the last commit)

The last commit was "course info, top matches and request prefill" on branch course-assistant (verify with git log -3 and git branch; it may not be merged into main yet). Pending verification: Part 1 tests, the unread badge in the Navbar, ratings flow with two accounts.

Test and merge Part 1 (course info card, Top 3 / Show all, request modal prefill).
Part 2: structured course reviews. Table course_reviews (course_id, user_id, difficulty 1-5, workload 1-5, tags text[] from a fixed list such as "practicals heavy", "tutorials matter", "scoring", year and semester taken, created_at). One per user per course; allowed only if the user has the course in profile_courses; no free text. SQL function returning aggregates with recent vs older split (for example last 2 years vs earlier) and counts. Show on the course detail page.
Part 3: grade cutoffs. Table grade_cutoffs (course_id, year, semester, thresholds for O/A+/A/B+/B/C, submitted_by). Only students who took the course can submit; show median per grade, number of submissions, and mark older batches as "past batch data" (feeds a confidence signal).
Safety (database done; UI left). In this order:
Apply step-c-reports.sql in Supabase (check first whether an older reports table or functions already exist), run test-reports.sql, expect RESULTS with 29 OK/PASS and 0 FAIL, then confirm the table counts are unchanged.
src/services/reports.js (reportConversation, listReports, moderateReport, unsuspendUser), hooks, and a Report modal in ChatPage with a reason picker (spam / harassment / inappropriate / other) and an optional 500-char detail box.
/moderation page (guard: moderator only; the database enforces it anyway): pending reports, the reported chat's messages, Dismiss / Suspend buttons. Needs an is_moderator() hook for the route guard.
Hide suspended users from Explore (decide how; do not expose the suspensions table to clients).
"Was this appropriate?" on rating, feeding reliability.
Small pitch items: alumni option and badge (graduation year), "Why this match" breakdown (show the five parts), stats view, Vitest unit tests for matchScore.js (npm.cmd install -D vitest, "test": "vitest run").
Data: credits/L-T-P for CSE and other branches (owner can send scheme screenshots); VLSI verification; assessment/prerequisites; official RAI/other scheme updates.
UI/UX handoff to the frontend developer after the Course page data layer is stable (rules: only change pages/, components/, CSS; do not touch services/, hooks/, context/, routes/, lib/; one branch, build must pass, pull request into main).
Optional later: skill-based ranking on the Skills tab using full match context, deployment (Vercel/Netlify with the two VITE_ env vars and the Supabase Auth redirect URLs), README polish.
Testing done so far (manual)

Integration (frontend with Supabase Auth, database, realtime), system (full user flow), black-box functional, negative (invalid URLs, outsiders opening chats, non-college emails), regression after each refactor, and SQL-simulated RLS tests (receiver cannot edit anything except status; only participants can rate; counts rolled back in transactions). Reports/moderation tests (test-reports.sql): 29 checks (reporter, outsider, unaccepted chat, anon, direct insert/update, self-promote to moderator, moderator reads, dismiss, suspend, moderator-cannot-suspend-moderator, unsuspend, suspended user blocked). Passes 29/29 on a local Postgres 16 that imitates Supabase roles and auth.uid(); with 3 deliberate policy mistakes the same script showed 8 FAILs. The script rolls everything back by ending with an intentional RESULTS | ... error. Not yet run on the real Supabase project. No automated (Vitest) tests yet.
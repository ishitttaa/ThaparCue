import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireProfile, RequireNoProfile, PublicOnly } from './guards';
// Step 1 ke hisaab se EK hi line rakho:
import RequireModerator from './RequireModerator';
// import { RequireModerator } from './RequireModerator';

import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import OnboardingPage from '../pages/app/OnboardingPage';
import DashboardPage from '../pages/app/DashboardPage';
import ExplorePage from '../pages/app/ExplorePage';
import SeniorProfilePage from '../pages/app/SeniorProfilePage';
import CoursesPage from '../pages/app/CoursesPage';
import CourseDetailPage from '../pages/app/CourseDetailPage';
import SkillsPage from '../pages/app/SkillsPage';
import InboxPage from '../pages/app/InboxPage';
import ChatPage from '../pages/app/ChatPage';
import ProfilePage from '../pages/app/ProfilePage';
import ModerationPage from '../pages/app/ModerationPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Sirf logged-out ── */}
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ── Logged-in ── */}
      <Route element={<RequireAuth />}>
        {/* Login ho gaya, profile nahi bani */}
        <Route element={<RequireNoProfile />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Login + profile dono */}
        <Route element={<RequireProfile />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/senior/:id" element={<SeniorProfilePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/inbox/:id" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Sirf moderators (database har call par dobara check karta hai) */}
          <Route element={<RequireModerator />}>
            <Route path="/moderation" element={<ModerationPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
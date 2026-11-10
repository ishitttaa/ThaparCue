import { useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomTabBar from './components/layout/BottomTabBar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

// Pages where the Navbar and bottom tab bar are hidden
const NO_NAVBAR_PATHS = ['/login', '/onboarding'];

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = NO_NAVBAR_PATHS.includes(pathname);

  return (
    <div className="app-shell">
      {!hideNavbar && <Navbar />}
      <main className="main-content">
        <AppRoutes />
      </main>
      {!hideNavbar && <BottomTabBar />}
    </div>
  );
}
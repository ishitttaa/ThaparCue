import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

// In pages par Navbar nahi dikhana
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
    </div>
  );
}

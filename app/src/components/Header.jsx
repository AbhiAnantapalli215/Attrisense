import { useState } from 'react'; // ✅ Add useState
import logo from '../assets/logo.png';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ new state for mobile menu

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  if (isAuthPage) {
    return (
      <header className="auth-header">
        <div className="header-left">
          <img src={logo} alt="App Logo" className="logo" />
        </div>
      </header>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <Link to="/dashboard" onClick={closeMenu}>
        <div className="header-left">
          <img src={logo} alt="App Logo" className="logo" />
        </div>
      </Link>

      <button
        className="menu-toggle"
        aria-label="Toggle Menu"
        onClick={toggleMenu}
      >
        &#9776; {/* Hamburger icon */}
      </button>

      <div className={`header-right ${menuOpen ? 'open' : ''}`}>
        <Link to="/dashboard" onClick={closeMenu}>
          <button
            className={`header-button dashboard-button ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </button>
        </Link>

        <Link to="/list" onClick={closeMenu}>
          <button
            className={`header-button list-button ${isActive('/list') ? 'active' : ''}`}
          >
            List
          </button>
        </Link>

        <Link to="/monitor" onClick={closeMenu}>
          <button
            className={`header-button danger-button monitor-button ${isActive('/monitor') ? 'active' : ''}`}
          >
            Monitor
          </button>
        </Link>

        <button
          className="header-button logout-button"
          onClick={() => {
            handleLogout();
            closeMenu();
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

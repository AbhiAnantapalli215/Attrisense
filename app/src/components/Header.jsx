import logo from '../assets/logo.png';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useLocation,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (isAuthPage) {
    // Header for login/signup pages (simplified version)
    return (
      <header className="auth-header">
        <div className="header-left">
          <img src={logo} alt="App Logo" className="logo" />
        </div>
      </header>
    );
  }

  // Default header for other pages
  return (
    <header className="app-header">
      <div className="header-left">
        <img src={logo} alt="App Logo" className="logo" />
      </div>

      <div className="header-right">
        <Link to="/dashboard">
          <button className="header-button dashboard-button">
            Dashboard
          </button>
        </Link>
        <Link to="/list">
          <button className="header-button list-button">
            List
          </button>
        </Link>
        <Link to="/monitor">
          <button className="header-button danger-button">
            Monitor
          </button>
        </Link>
        <button 
          className="header-button logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
        
      </div>
    </header>
  );
};

export default Header;
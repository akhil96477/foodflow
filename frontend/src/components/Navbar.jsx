import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar({ isAuthenticated, role, onLogout }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .navbar-glass {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(13, 13, 13, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .navbar-glass.scrolled {
          background: rgba(13, 13, 13, 0.92);
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        .navbar-inner {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Outfit', sans-serif;
        }
        .nav-center {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-link-item {
          color: #aaa;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease;
          position: relative;
          padding: 4px 0;
          text-decoration: none;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-link-item:hover { color: #fff; }
        .nav-link-item:hover::after { width: 100%; }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-icon-btn {
          position: relative;
          color: #aaa;
          transition: color 0.2s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 10px;
        }
        .nav-icon-btn:hover { color: #fff; transform: scale(1.1); }
        .nav-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(255,138,0,0.15), rgba(229,46,113,0.15));
          color: #ff8a00;
          font-weight: 600;
          font-size: 0.85rem;
          border: 1px solid rgba(255,138,0,0.25);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .nav-admin-btn:hover {
          background: linear-gradient(135deg, rgba(255,138,0,0.25), rgba(229,46,113,0.25));
          color: #ff8a00;
          transform: translateY(-1px);
        }
        .nav-login-btn {
          padding: 8px 20px;
          border-radius: 10px;
          color: #ccc;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .nav-login-btn:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
        .nav-signup-btn {
          padding: 8px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF6B35, #FF3F00);
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255,107,53,0.3);
          text-decoration: none;
        }
        .nav-signup-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,53,0.4); color: #fff; }
        .nav-logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .nav-logout-btn:hover { color: #ef4444; transform: scale(1.1); }
      `}</style>

      <nav className={scrolled ? 'navbar-glass scrolled' : 'navbar-glass'}>
        <div className="navbar-inner">
          <Link to="/" className="nav-brand">
            <span style={{ fontSize: '1.6rem' }}>🍔</span>
            <span className="nav-brand-text">Foodiefy</span>
          </Link>

          <div className="nav-center">
            <Link to="/restaurants" className="nav-link-item">Restaurants</Link>
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {role === 'ADMIN' && (
                  <Link to="/admin" className="nav-admin-btn">
                    <LayoutDashboard size={16} /> Admin
                  </Link>
                )}
                <Link to="/cart" className="nav-icon-btn">
                  <ShoppingBag size={22} />
                </Link>
                <Link to="/orders" className="nav-icon-btn" title="Orders">
                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                </Link>
                <Link to="/profile" className="nav-icon-btn" title="Profile">
                  <User size={22} />
                </Link>
                <button onClick={handleLogout} className="nav-logout-btn">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-login-btn">Log In</Link>
                <Link to="/register" className="nav-signup-btn">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
}

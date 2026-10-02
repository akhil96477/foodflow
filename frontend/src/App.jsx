import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (requireAdmin && role !== 'ADMIN') return <Navigate to="/" />;

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
    
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <>
      {showSplash && (
        <div className="splash-screen" style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: '#050505',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeOut 0.8s ease-out 2.8s forwards',
          perspective: '1200px', overflow: 'hidden'
        }}>
          {/* Futuristic grid background */}
          <div style={{
            position: 'absolute', width: '200%', height: '200%', bottom: '-50%', left: '-50%',
            backgroundImage: 'linear-gradient(rgba(255, 107, 53, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 53, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px', transform: 'rotateX(75deg)', animation: 'gridMove 3s linear infinite', zIndex: 0
          }} />

          {/* 3D Glowing Rings */}
          <div className="ring ring1"></div>
          <div className="ring ring2"></div>

          <div style={{
            position: 'relative', zIndex: 10,
            fontSize: '5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 900,
            color: '#fff', textTransform: 'uppercase', letterSpacing: '8px',
            textShadow: '0 0 20px #FF6B35, 0 0 40px #FF3F00, 0 0 60px #FF0055',
            animation: 'splashLogo3D 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}>
            <span style={{ fontSize: '4rem', verticalAlign: 'middle', marginRight: '10px' }}>🍔</span> 
            Foodiefy
          </div>

          <style>{`
            .ring {
              position: absolute;
              border-radius: 50%;
              border: 2px solid rgba(255, 107, 53, 0.8);
              box-shadow: 0 0 20px rgba(255, 107, 53, 0.5), inset 0 0 20px rgba(255, 107, 53, 0.5);
              animation: ringSpin 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              z-index: 1;
            }
            .ring1 { width: 400px; height: 400px; border-top: 2px solid transparent; border-bottom: 2px solid transparent; }
            .ring2 { width: 500px; height: 500px; border-left: 2px solid transparent; border-right: 2px solid transparent; animation-direction: reverse; animation-duration: 4s; }

            @keyframes ringSpin {
              0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg) scale(0); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(180deg) scale(1.5); opacity: 0; }
            }
            @keyframes gridMove {
              0% { background-position: 0 0; }
              100% { background-position: 0 40px; }
            }
            @keyframes splashLogo3D {
              0% { transform: translateZ(-1000px) rotateX(70deg) rotateY(-30deg) scale(0.1); opacity: 0; letter-spacing: -10px; }
              40% { transform: translateZ(100px) rotateX(-10deg) rotateY(10deg) scale(1.2); opacity: 1; letter-spacing: 12px; }
              100% { transform: translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1); opacity: 1; letter-spacing: 8px; }
            }
            @keyframes fadeOut {
              from { opacity: 1; pointer-events: all; }
              to { opacity: 0; pointer-events: none; }
            }
          `}</style>
        </div>
      )}
      <Router>
      <Navbar isAuthenticated={isAuthenticated} role={role} onLogout={handleLogout} />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </Router>
    </>
  );
}

export default App;

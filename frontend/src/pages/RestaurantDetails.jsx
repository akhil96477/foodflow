import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurants, foods, cart } from '../services/api';
import { ShoppingCart, CheckCircle } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    Promise.all([
      restaurants.getById(id),
      foods.getMenu(id)
    ]).then(([resData, menuData]) => {
      setRestaurant(resData.data);
      setMenu(menuData.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async (foodId, foodName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await cart.add({ foodItemId: foodId, quantity: 1 });
      setToastMessage(`Added ${foodName} to cart`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container page-container">Loading...</div>;
  if (!restaurant) return <div className="container page-container">Restaurant not found</div>;

  return (
    <div className="container page-container">
      <div style={{ position: 'relative', height: '300px', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '40px' }}>
        <img src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000'} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontFamily: "'Playfair Display', serif" }}>{restaurant.name}</h1>
          <p style={{ color: '#eee', fontSize: '1.2rem' }}>{restaurant.address}</p>
        </div>
      </div>
      
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '20px' }}>Menu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {menu.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', padding: '20px', gap: '20px' }}>
            <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{item.name}</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{item.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{item.price}</span>
                <button onClick={() => handleAddToCart(item.id, item.name)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showToast && (
        <div style={{
          position: 'fixed', bottom: '40px', right: '40px',
          background: '#10b981', color: '#fff',
          padding: '16px 24px', borderRadius: '50px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)', zIndex: 1000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

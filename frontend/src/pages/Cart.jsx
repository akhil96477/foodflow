import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cart as cartApi } from '../services/api';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await cartApi.get();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await cartApi.remove(id);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '4px solid rgba(255,107,53,0.2)',
        borderTopColor: '#FF6B35',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );

  return (
    <div className="container page-container">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>Your Cart</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Review your items and proceed to checkout.</p>
      </div>
      
      {!cart || !cart.cartItems || cart.cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={48} style={{ color: 'var(--primary)' }} />
            </div>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', marginBottom: '15px' }}>Your cart is empty</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>Looks like you haven't added anything to your cart yet. Discover our premium restaurants and dishes!</p>
          <Link to="/restaurants" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            Browse Restaurants <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.cartItems.map((item, index) => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '20px', gap: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img 
                  src={`https://images.unsplash.com/photo-${1568901346375 + index}?w=200`} 
                  alt={item.foodItemName} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: '4px' }}>{item.foodItemName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-light)' }}>
                    <span style={{ fontSize: '0.95rem' }}>Qty: <strong style={{ color: '#fff' }}>{item.quantity}</strong></span>
                  </div>
                </div>
                <button onClick={() => handleRemove(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div>
            <div className="card glass" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-light)' }}>
                <span>Subtotal ({cart.cartItems.length} items)</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>₹{cart.totalAmount || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-light)' }}>
                <span>Delivery Fee</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.4rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{cart.totalAmount || '0.00'}</span>
              </div>
              
              <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '32px', fontSize: '1.1rem', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

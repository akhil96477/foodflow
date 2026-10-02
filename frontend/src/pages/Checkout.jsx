import { orders } from '../services/api';
import { useState } from 'react';
import { CreditCard, Truck, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await orders.place();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to initialize checkout');
      setLoading(false);
    }
  };

  return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card glass animate-slide-up hover-3d" style={{ maxWidth: '500px', width: '100%', padding: '50px 40px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background decorative glow inside the card */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', color: 'var(--primary)' }}>
            <CreditCard size={32} />
            <Truck size={32} />
          </div>
          
          <h1 className="playfair-heading" style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center' }}>Checkout</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '30px', lineHeight: 1.6, textAlign: 'center' }}>
            You're almost there! Click the button below to proceed to our secure Stripe checkout.
          </p>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '30px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#10b981', margin: '15px 0', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} />
              <span>Secure Checkout powered by Stripe</span>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="btn btn-primary" 
              style={{ 
                width: '100%', fontSize: '1.2rem', padding: '18px', borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
              }}
            >
              {loading ? (
                <div style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <CheckCircle size={22} />
                  Proceed to Secure Checkout
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

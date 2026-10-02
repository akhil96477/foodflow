import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card glass animate-slide-up hover-3d" style={{ maxWidth: '500px', width: '100%', padding: '60px 40px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        
        {/* Glowing Background */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: '#10b981', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ 
            color: '#10b981', 
            marginBottom: '30px',
            transform: animated ? 'scale(1)' : 'scale(0.5)',
            opacity: animated ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <CheckCircle size={100} style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))' }} />
          </div>

          <h1 className="playfair-heading" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Payment Successful!</h1>
          
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Thank you for your order. Your payment has been processed securely.
            {sessionId && <span style={{ display: 'block', marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>Session ID: {sessionId.substring(0, 12)}...</span>}
          </p>

          <button 
            onClick={() => navigate('/orders')}
            className="btn btn-primary" 
            style={{ 
              width: '100%', fontSize: '1.2rem', padding: '16px', borderRadius: '12px',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
            }}
          >
            <Package size={20} />
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

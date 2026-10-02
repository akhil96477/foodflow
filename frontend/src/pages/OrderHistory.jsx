import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../services/api';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrderHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orders.getHistory()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,107,53,0.2)', borderTopColor: '#FF6B35', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="container page-container" style={{ maxWidth: '800px' }}>
      <h1 className="playfair-heading animate-slide-up" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Your Orders</h1>
      
      {data.length === 0 ? (
        <div className="animate-slide-up stagger-1" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>You haven't placed any orders. Start exploring!</p>
          <Link to="/restaurants" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '50px' }}>Explore Restaurants</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {data.map((order, idx) => (
            <div key={order.id} className={`card glass hover-3d animate-slide-up stagger-${(idx % 5) + 1}`} style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}>
              <div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order #{order.id}</p>
                <p style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '12px', color: '#fff' }}>₹{order.totalAmount}</p>
                <span className={`status-badge status-${order.orderStatus}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  {order.orderStatus}
                </span>
              </div>
              <Link to={`/orders/${order.id}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px' }}>
                Track <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

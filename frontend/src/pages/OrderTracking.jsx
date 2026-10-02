import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orders } from '../services/api';
import { MapPin, Clock, Package, CheckCircle, ChefHat, Bike } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stompClient = null;

    const fetchOrder = async () => {
      try {
        const { data } = await orders.getById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Connect to WebSocket
    const connectWebSocket = () => {
      // Create a SockJS client pointing to backend ws endpoint
      const socket = new SockJS('/api/ws-endpoint');
      stompClient = new Client({
        webSocketFactory: () => socket,
        debug: function (str) { console.log(str); },
        onConnect: () => {
          console.log('Connected to WS');
          // Subscribe to the specific order's topic
          stompClient.subscribe(`/topic/orders/${id}`, (msg) => {
            if (msg.body) {
              const updatedOrder = JSON.parse(msg.body);
              console.log('Received real-time update:', updatedOrder);
              setOrder(updatedOrder);
            }
          });
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        }
      });
      stompClient.activate();
    };

    connectWebSocket();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [id]);

  if (loading) return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,107,53,0.2)', borderTopColor: '#FF6B35', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!order) return <div className="container page-container" style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '50px' }}>Order not found</div>;

  const statuses = [
    { key: 'PLACED', label: 'Order Placed', icon: Package },
    { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="container page-container" style={{ maxWidth: '800px' }}>
      <div className="card glass animate-slide-up hover-3d" style={{ overflow: 'hidden', padding: 0 }}>
        
        {/* Map Placeholder Header */}
        <div style={{ height: '200px', background: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000) center/cover no-repeat', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--surface))' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '30px' }}>
            <h2 className="playfair-heading" style={{ fontSize: '2.5rem', margin: 0 }}>Order #{order.id}</h2>
            <p style={{ color: '#ddd', fontSize: '1.1rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Estimated delivery: 30-45 mins
            </p>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>Total: ₹{order.totalAmount}</span>
          </div>
          
          {order.orderStatus === 'CANCELLED' ? (
            <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '10px' }}>Order Cancelled</h3>
              <p style={{ color: 'var(--text-light)' }}>Unfortunately, this order was cancelled.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginBottom: '20px' }}>
              {/* Progress Line */}
              <div style={{ position: 'absolute', top: '24px', left: '60px', right: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', zIndex: 0, borderRadius: '2px' }}>
                <div style={{ 
                  width: `${currentStatusIndex > 0 ? (currentStatusIndex / (statuses.length - 1)) * 100 : 0}%`, 
                  height: '100%', background: 'var(--primary-gradient)', transition: 'width 1s ease-in-out', borderRadius: '2px' 
                }} />
              </div>

              {/* Status Steps */}
              {statuses.map((s, idx) => {
                const isActive = idx <= currentStatusIndex;
                const Icon = s.icon;
                return (
                  <div key={s.key} className={`stagger-${idx + 1} animate-slide-up`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, width: '100px' }}>
                    <div style={{ 
                      width: '50px', height: '50px', borderRadius: '50%', 
                      background: isActive ? 'var(--primary-gradient)' : 'var(--surface-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isActive ? '0 0 20px rgba(255, 107, 53, 0.5)' : 'none',
                      transition: 'all 0.4s ease', border: isActive ? 'none' : '2px solid rgba(255,255,255,0.1)',
                      marginBottom: '15px'
                    }}>
                      <Icon size={24} color={isActive ? '#fff' : '#666'} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 400, color: isActive ? '#fff' : 'var(--text-light)', textAlign: 'center' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

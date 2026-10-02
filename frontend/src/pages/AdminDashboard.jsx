import { useState, useEffect } from 'react';
import { orders as ordersApi, restaurants as restaurantsApi, foods as foodsApi } from '../services/api';
import { LayoutDashboard, ShoppingBag, Store, UtensilsCrossed, Plus, X, Save } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ORDERS');
  const [orders, setOrders] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showResModal, setShowResModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  // Form states
  const [resForm, setResForm] = useState({ name: '', description: '', address: '', imageUrl: '' });
  const [foodForm, setFoodForm] = useState({ restaurantId: '', name: '', description: '', price: '', imageUrl: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, restRes] = await Promise.all([
        ordersApi.getAll(),
        restaurantsApi.getAll()
      ]);
      setOrders(ordersRes.data);
      setRestaurantsList(restRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await restaurantsApi.create(resForm);
      setShowResModal(false);
      setResForm({ name: '', description: '', address: '', imageUrl: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      await foodsApi.create(foodForm);
      setShowFoodModal(false);
      setFoodForm({ restaurantId: '', name: '', description: '', price: '', imageUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,107,53,0.2)', borderTopColor: '#FF6B35', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="container page-container">
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="playfair-heading" style={{ fontSize: '3rem' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowResModal(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px' }}>
            <Store size={18} /> New Restaurant
          </button>
          <button onClick={() => setShowFoodModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px' }}>
            <Plus size={18} /> Add Food Item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="animate-slide-up stagger-1" style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
        <button onClick={() => setActiveTab('ORDERS')} style={{ background: 'none', border: 'none', color: activeTab === 'ORDERS' ? 'var(--primary)' : 'var(--text-light)', fontSize: '1.2rem', fontWeight: activeTab === 'ORDERS' ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} /> Manage Orders
        </button>
        <button onClick={() => setActiveTab('RESTAURANTS')} style={{ background: 'none', border: 'none', color: activeTab === 'RESTAURANTS' ? 'var(--primary)' : 'var(--text-light)', fontSize: '1.2rem', fontWeight: activeTab === 'RESTAURANTS' ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={20} /> Restaurants
        </button>
      </div>

      {activeTab === 'ORDERS' && (
        <div className="card glass animate-slide-up stagger-2" style={{ padding: '30px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px', color: 'var(--text-light)' }}>Order ID</th>
                <th style={{ padding: '15px', color: 'var(--text-light)' }}>Total</th>
                <th style={{ padding: '15px', color: 'var(--text-light)' }}>Status</th>
                <th style={{ padding: '15px', color: 'var(--text-light)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px', fontWeight: 600 }}>#{order.id}</td>
                  <td style={{ padding: '15px' }}>₹{order.totalAmount}</td>
                  <td style={{ padding: '15px' }}>
                    <span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'RESTAURANTS' && (
        <div className="animate-slide-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {restaurantsList.map(res => (
            <div key={res.id} className="card glass hover-3d" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <img src={res.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} alt={res.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{res.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ID: {res.id}</span>
                </div>
              </div>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{res.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="status-badge status-DELIVERED">Active</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{res.address}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restaurant Modal */}
      {showResModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card glass animate-slide-up" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 className="playfair-heading" style={{ margin: 0, fontSize: '2rem' }}>New Restaurant</h2>
              <button onClick={() => setShowResModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Restaurant Name" required value={resForm.name} onChange={e => setResForm({...resForm, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="text" placeholder="Address" required value={resForm.address} onChange={e => setResForm({...resForm, address: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <textarea placeholder="Description" rows={3} required value={resForm.description} onChange={e => setResForm({...resForm, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="text" placeholder="Image URL (optional)" value={resForm.imageUrl} onChange={e => setResForm({...resForm, imageUrl: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}><Save size={18}/> Create Restaurant</button>
            </form>
          </div>
        </div>
      )}

      {/* Food Item Modal */}
      {showFoodModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card glass animate-slide-up" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 className="playfair-heading" style={{ margin: 0, fontSize: '2rem' }}>Add Food Item</h2>
              <button onClick={() => setShowFoodModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateFood} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select required value={foodForm.restaurantId} onChange={e => setFoodForm({...foodForm, restaurantId: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
                <option value="" style={{ color: '#000' }}>Select Restaurant...</option>
                {restaurantsList.map(r => <option key={r.id} value={r.id} style={{ color: '#000' }}>{r.name}</option>)}
              </select>
              <input type="text" placeholder="Food Name" required value={foodForm.name} onChange={e => setFoodForm({...foodForm, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="number" placeholder="Price (₹)" step="0.01" required value={foodForm.price} onChange={e => setFoodForm({...foodForm, price: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <textarea placeholder="Description" rows={3} required value={foodForm.description} onChange={e => setFoodForm({...foodForm, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <input type="text" placeholder="Image URL (optional)" value={foodForm.imageUrl} onChange={e => setFoodForm({...foodForm, imageUrl: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}><Save size={18}/> Add Food</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

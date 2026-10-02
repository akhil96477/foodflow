import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurants } from '../services/api';
import { Search, MapPin } from 'lucide-react';

export default function Restaurants() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchRestaurants = () => {
      setLoading(true);
      restaurants.getAll(searchTerm)
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };
    
    const debounceTimer = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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
      <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="playfair-heading" style={{ fontSize: '3.5rem', marginBottom: '15px' }}>Our Featured Restaurants</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', marginBottom: '30px' }}>
          Explore our curated selection of premium dining experiences.
        </p>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search for restaurants or descriptions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '16px 20px 16px 50px', borderRadius: '50px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
        </div>
        
        {/* Categories / Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['All', 'Indian', 'Italian', 'Chinese', 'Healthy'].map(cat => (
            <button 
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchTerm(cat === 'All' ? '' : cat);
              }}
              style={{
                padding: '8px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.1)',
                color: '#fff', fontWeight: 600, transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
        {data.map((restaurant, index) => (
          <div key={restaurant.id} className={`card glass hover-3d animate-slide-up stagger-${(index % 5) + 1}`} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              <img 
                src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} 
                alt={restaurant.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))' }} />
              <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px' }}>
                <h3 className="playfair-heading" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '5px' }}>{restaurant.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ddd', fontSize: '0.9rem' }}>
                  <MapPin size={14} />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <p style={{ color: 'var(--text-light)', marginBottom: '25px', flex: 1, lineHeight: 1.6 }}>{restaurant.description}</p>
              <Link to={`/restaurants/${restaurant.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                View Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

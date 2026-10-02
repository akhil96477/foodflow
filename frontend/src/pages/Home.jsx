import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Truck, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { restaurants as restaurantApi } from '../services/api';

const popularDishes = [
  { id: 1, name: 'Classic Burger', price: '₹250', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 2, name: 'Margherita Pizza', price: '₹400', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 3, name: 'BBQ Ribs', price: '₹800', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
  { id: 4, name: 'Healthy Salad', price: '₹180', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
  { id: 5, name: 'Truffle Pasta', price: '₹550', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400' },
  { id: 6, name: 'Sushi Platter', price: '₹900', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' }
];

const floatingEmojis = ['🍕', '🍔', '🌮', '🍣', '🥗', '🍜', '🍰', '🥘'];

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantApi.getAll()
      .then(res => {
        setFeaturedRestaurants((res.data || res).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0D0D0D' }}>

      {/* ========== HERO SECTION ========== */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 20px 100px',
        backgroundImage: `linear-gradient(to bottom, rgba(13,13,13,0.6), rgba(13,13,13,0.92)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        {/* Floating Emojis */}
        {floatingEmojis.map((emoji, i) => (
          <span key={i} style={{
            position: 'absolute',
            fontSize: `${1.8 + Math.random() * 1.5}rem`,
            top: `${10 + (i * 10)}%`,
            left: `${5 + (i * 12)}%`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.5,
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            {emoji}
          </span>
        ))}

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            color: '#fff'
          }}>
            Delicious Food,<br />
            <span style={{
              background: 'linear-gradient(90deg, #fbbf24, #f97316, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Delivered Fast</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: '#b0b0b0',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            Discover the finest restaurants near you. Premium quality food delivered to your doorstep in minutes.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/restaurants" className="btn btn-primary" style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: '50px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #FF6B35, #FF3F00)',
              boxShadow: '0 8px 30px rgba(255,107,53,0.35)'
            }}>
              Order Now <ArrowRight size={20} />
            </Link>
            <Link to="/restaurants" style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: '50px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}>
              View Menu
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '900px',
          zIndex: 2
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '24px 32px',
            borderRadius: '24px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {[
              { value: '500+', label: 'Restaurants' },
              { value: '10k+', label: 'Deliveries' },
              { value: '4.9★', label: 'Rating' },
              { value: '30min', label: 'Avg Delivery' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section style={{ padding: '120px 20px', background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 700,
              marginBottom: '16px',
              background: 'linear-gradient(90deg, #fbbf24, #f97316, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>How It Works</h2>
            <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '500px', margin: '0 auto' }}>
              Your favorite food is just three simple steps away
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {[
              { Icon: Search, title: 'Choose Restaurant', desc: 'Browse our extensive list of premium restaurants and curated menus designed for your cravings.', step: '01' },
              { Icon: ShoppingBag, title: 'Place Your Order', desc: 'Select your favorite dishes, customize them to your liking, and securely checkout.', step: '02' },
              { Icon: Truck, title: 'Fast Delivery', desc: 'Track your order in real-time as our delivery partners swiftly bring it to your door.', step: '03' }
            ].map((feature, i) => (
              <div key={i} className="card" style={{
                position: 'relative',
                padding: '40px',
                borderRadius: '24px',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s ease',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.03)',
                  fontFamily: "'Outfit', sans-serif"
                }}>{feature.step}</div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,63,0,0.15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: '#FF6B35',
                  border: '1px solid rgba(255,107,53,0.2)'
                }}>
                  <feature.Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: '#888', lineHeight: 1.7, fontSize: '1rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR DISHES ========== */}
      <section style={{ padding: '120px 20px', background: '#111', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Popular Dishes</h2>
              <p style={{ fontSize: '1.15rem', color: '#888' }}>Taste the best from our top-rated menus</p>
            </div>
            <Link to="/restaurants" style={{ color: '#FF6B35', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.05rem' }}>
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '24px',
            paddingBottom: '20px',
            scrollSnapType: 'x mandatory'
          }}>
            {popularDishes.map((dish) => (
              <div key={dish.id} style={{
                minWidth: '300px',
                background: '#1a1a1a',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                transition: 'all 0.4s ease'
              }} className="card">
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={dish.image} alt={dish.name} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }} />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    padding: '6px 14px', borderRadius: '12px',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>{dish.price}</div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{dish.name}</h3>
                  <Link to="/restaurants" className="btn" style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#ccc',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'block'
                  }}>
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED RESTAURANTS ========== */}
      <section style={{ padding: '120px 20px', background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Featured Restaurants</h2>
            <p style={{ fontSize: '1.15rem', color: '#888' }}>Hand-picked premium selections for your cravings</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '4px solid rgba(255,107,53,0.2)',
                borderTopColor: '#FF6B35',
                animation: 'spin 0.8s linear infinite'
              }} />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}>
              {featuredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="card" style={{
                  background: '#1a1a1a',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s ease'
                }}>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
                      alt={restaurant.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(255,255,255,0.95)',
                      color: '#000', padding: '4px 10px', borderRadius: '8px',
                      fontSize: '0.85rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      4.5
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{restaurant.name}</h3>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#222', padding: '6px 12px', borderRadius: '8px',
                        fontSize: '0.85rem', color: '#aaa'
                      }}>
                        <Clock size={14} style={{ color: '#FF6B35' }} /> 30-45 min
                      </span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#222', padding: '6px 12px', borderRadius: '8px',
                        fontSize: '0.85rem', color: '#aaa',
                        maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        <MapPin size={14} style={{ color: '#FF6B35' }} /> {restaurant.address}
                      </span>
                    </div>
                    <Link to={`/restaurants/${restaurant.id}`} className="btn" style={{
                      width: '100%',
                      display: 'block',
                      textAlign: 'center',
                      padding: '14px',
                      borderRadius: '14px',
                      background: '#222',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.3s ease'
                    }}>
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section style={{
        padding: '120px 20px',
        background: 'linear-gradient(135deg, #ef4444, #f97316)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1495147466023-e6a2b6bc1b7e?w=1920')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.08, mixBlendMode: 'overlay'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>Ready to Order?</h2>
          <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', lineHeight: 1.7 }}>
            Join thousands of food lovers and experience the best food delivery service in town.
          </p>
          <Link to="/register" style={{
            display: 'inline-block',
            padding: '18px 48px',
            background: '#fff',
            color: '#ef4444',
            borderRadius: '50px',
            fontWeight: 800,
            fontSize: '1.2rem',
            textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease'
          }}>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(255,107,53,0.15); border-color: rgba(255,107,53,0.3) !important; }
        .card:hover img { transform: scale(1.08); }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { users } from '../services/api';
import { User, MapPin, Phone, Mail, Save } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', address: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    users.getProfile()
      .then(res => {
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          address: res.data.address || '',
          phone: res.data.phone || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await users.updateProfile({ name: profile.name, address: profile.address, phone: profile.phone });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,107,53,0.2)', borderTopColor: '#FF6B35', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="container page-container" style={{ maxWidth: '600px' }}>
      <div className="card glass animate-slide-up hover-3d" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={40} />
            </div>
            <div>
              <h1 className="playfair-heading" style={{ fontSize: '2.5rem', marginBottom: '5px' }}>My Profile</h1>
              <p style={{ color: 'var(--text-light)' }}>Manage your personal details</p>
            </div>
          </div>

          {message && (
            <div style={{ background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? '#10b981' : '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '25px', border: `1px solid ${message.includes('success') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, textAlign: 'center' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
                <User size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Email Address (Cannot be changed)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" value={profile.email} disabled
                  style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#888', outline: 'none' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#666' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="e.g. +91 9876543210"
                  style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ccc' }}>Delivery Address</label>
              <div style={{ position: 'relative' }}>
                <textarea 
                  value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Enter your full delivery address" rows={3}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '16px', borderRadius: '12px', fontSize: '1.1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {saving ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Save size={20} /> Save Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

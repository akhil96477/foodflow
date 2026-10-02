export default function Footer() {
  return (
    <>
      <style>{`
        .footer-main {
          background: #0a0a0a;
          position: relative;
          padding: 60px 0 0;
          color: #fff;
        }
        .footer-main::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35, #e52e71, #FF6B35);
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
        }
        .footer-brand-name {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }
        .footer-tagline {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .footer-socials {
          display: flex;
          gap: 10px;
        }
        .social-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #888;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .social-circle:hover {
          background: rgba(255,107,53,0.15);
          border-color: rgba(255,107,53,0.4);
          color: #FF6B35;
          transform: translateY(-2px);
        }
        .footer-heading {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          font-family: 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links li {
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .footer-links li:hover {
          color: #FF6B35;
          padding-left: 4px;
        }
        .app-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ccc;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }
        .app-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .app-btn-icon {
          font-size: 1.4rem;
        }
        .app-btn-text-small {
          font-size: 0.7rem;
          color: #888;
        }
        .app-btn-text-large {
          font-weight: 700;
          font-size: 0.95rem;
          color: #fff;
        }
        .footer-bottom {
          margin-top: 50px;
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copyright {
          color: #555;
          font-size: 0.85rem;
        }
        .footer-love {
          color: #555;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-bottom {
            justify-content: center;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer className="footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <div className="footer-brand-name">🍔 Foodiefy</div>
            <p className="footer-tagline">
              Premium food delivery at your doorstep. Discover the best restaurants and flavors in your city.
            </p>
            <div className="footer-socials">
              <div className="social-circle">𝕏</div>
              <div className="social-circle">in</div>
              <div className="social-circle">ig</div>
              <div className="social-circle">fb</div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li>Help Center</li>
              <li>Safety</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="footer-heading">Get the App</h4>
            <div className="app-btn">
              <span className="app-btn-icon">🍎</span>
              <div>
                <div className="app-btn-text-small">Download on the</div>
                <div className="app-btn-text-large">App Store</div>
              </div>
            </div>
            <div className="app-btn">
              <span className="app-btn-icon">▶️</span>
              <div>
                <div className="app-btn-text-small">Get it on</div>
                <div className="app-btn-text-large">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">© 2026 Foodiefy. All rights reserved.</div>
          <div className="footer-love">Made with ❤️ for food lovers</div>
        </div>
      </footer>
    </>
  );
}

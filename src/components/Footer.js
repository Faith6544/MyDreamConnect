import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* === MAIN GRID === */}
        <div className="footer-main">

          {/* Column 1 — Brand */}
          <div className="footer-brand">
            <img
              src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo-transparent.png"
              alt="MyDreamConnect"
              className="footer-logo"
            />
            <p className="footer-tagline">
              Committed to coaching leaders to thrive. Be educated so that
              you can change the world.
            </p>

            <div className="footer-socials">
              <a href="https://web.facebook.com/MyDreamConnect" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/mydreamconnect" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://twitter.com/mydreamconnect" target="_blank" rel="noreferrer" aria-label="X" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="http://linkedin.com/company/mydreamconnect-learning-centre" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UCzGmgTBsYvN4vWFgB_ea1aw/videos" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0a1f0d"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/blog">Blogs</Link></li>
              <li><Link to="/media">Media</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
              <li><Link to="/partnership">Partnership</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 3 — Our Programs */}
          <div className="footer-col">
            <h4>Our Programs</h4>
            <ul>
              <li><Link to="/about">SHAPE</Link></li>
              <li><Link to="/about">STAR</Link></li>
              <li><Link to="/about">MIX</Link></li>
              <li><Link to="/about">BACK TO SCHOOL</Link></li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="footer-col footer-contact">
            <h4>Get In Touch</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-ico">📞</span>
                <a href="tel:+2348128936463">+234 (812) 893 6463</a>
              </li>
              <li>
                <span className="contact-ico">✉️</span>
                <a href="mailto:info@mydreamconnect.org.ng">info@mydreamconnect.org.ng</a>
              </li>
              <li>
                <span className="contact-ico">📍</span>
                <span>Nice Estate, Ota, Ogun State · Alagbado, Lagos State</span>
              </li>
            </ul>
          </div>

        </div>

        {/* === BOTTOM BAR === */}
        <div className="footer-bottom">
          <p>© {year} MyDreamConnect. All rights reserved.</p>
          <a href="mailto:info@mydreamconnect.org.ng">info@mydreamconnect.org.ng</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
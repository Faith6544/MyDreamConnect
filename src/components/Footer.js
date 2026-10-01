import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Create this CSS file

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* Column 1: About & Contact */}
        <div className="footer-column">
          <img src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo.png" alt="MyDreamConnect" className="footer-logo" />
          <p className="footer-desc">Committed to coaching leaders to thrive. Be educated so that you can change the world.</p>
          <ul className="footer-contact">
            <li>📞 +234 (812) 893 6463</li>
            <li>✉️ info@mydreamconnect.org.ng</li>
            <li>📍 Nice Estate, Ota, Ogun State || Alagbado, Lagos State.</li>
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
  <h3>Quick Links</h3>
  <ul className="footer-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About Us</Link></li>
    <li><Link to="/courses">Courses</Link></li>
    <li><Link to="/blog">Blogs</Link></li>
    <li><Link to="/media/photos">Media</Link></li>
    <li><Link to="/donate">Donate</Link></li>
    <li><Link to="/volunteer">Volunteer</Link></li>
    <li><Link to="/partnership">Partnership</Link></li>
    <li><Link to="/contact">Contact</Link></li>
    <li><Link to="/terms">Terms &amp; Conditions</Link></li>
  </ul>
</div>

        {/* Column 3: Programs */}
        <div className="footer-column">
          <h3>Our Programs</h3>
          <ul className="footer-links">
            <li><Link to="/about">SHAPE</Link></li>
            <li><Link to="/about">STAR</Link></li>
            <li><Link to="/about">MIX</Link></li>
            <li><Link to="/about">BACK TO SCHOOL</Link></li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a href="http://linkedin.com/company/mydreamconnect-learning-centre" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://web.facebook.com/MyDreamConnect" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/mydreamconnect" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://twitter.com/mydreamconnect" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.youtube.com/channel/UCzGmgTBsYvN4vWFgB_ea1aw/videos" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>Copyright © 2026 MyDreamConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-content">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page Not Found</h2>
        <p className="nf-text">
          The page you are looking for does not exist, was removed, or is
          temporarily unavailable.
        </p>
        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">Go Home</Link>
          <Link to="/contact" className="nf-btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
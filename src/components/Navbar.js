import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SearchModal from './SearchModal';
import './Navbar.css';

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          
          {/* LOGO */}
          <Link to="/" className="navbar-logo-link">
            <img 
              src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo.png" 
              alt="MyDreamConnect Logo" 
              className="navbar-logo-img"
              style={{ 
                width: '55px', 
                height: '55px', 
                objectFit: 'contain', 
                border: 'none' 
              }} 
            />
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="mobile-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* NAVIGATION LINKS */}
          <nav className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/media">Media</Link>
            <Link to="/talent">Talent Marketplace</Link>
            <Link to="/blog">Blogs</Link>
            <Link to="/contact">Contact</Link>
            
            <button 
              className="search-trigger" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              🔍
            </button>

            <div className="nav-auth">
              {user ? (
                <>
                  <Link to="/my-courses" className="nav-btn btn-dark">My Courses</Link>
                  <button onClick={handleLogout} className="nav-btn btn-outline">Log out</button>
                </>
              ) : (
                <Link to="/get-started" className="nav-btn btn-outline">Sign In</Link>
              )}
            </div>
          </nav>

        </div>
      </header>

      {/* SEARCH MODAL */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}

export default Navbar;
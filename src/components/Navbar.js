import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchModal from './SearchModal';
import './Navbar.css';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [talentOpen, setTalentOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => {
    setMobileOpen(false);
    setMediaOpen(false);
    setTalentOpen(false);
  };

  return (
    <>
      <nav className="main-navbar">
        <div className="nav-container">

          <Link to="/" className="logo" onClick={closeMenu}>
            <img
              src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo.png"
              alt="MyDreamConnect Logo"
            />
          </Link>

          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>

            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>

            <li className={`has-dropdown ${mediaOpen ? 'open' : ''}`}>
              <span className="nav-parent" onClick={() => setMediaOpen(!mediaOpen)}>
                Media <span className="caret">▾</span>
              </span>
             <ul className="dropdown">
  <li><Link to="/media/photos" onClick={closeMenu}>Photos</Link></li>
  <li><Link to="/media/videos" onClick={closeMenu}>Videos</Link></li>
  <li><Link to="/media/flyers" onClick={closeMenu}>Flyers</Link></li>
</ul>
            </li>

            <li className={`has-dropdown ${talentOpen ? 'open' : ''}`}>
              <span className="nav-parent" onClick={() => setTalentOpen(!talentOpen)}>
                Talent Marketplace <span className="caret">▾</span>
              </span>
              <ul className="dropdown">
                <li><Link to="/talent" onClick={closeMenu}>Browse Talents</Link></li>
                <li><Link to="/talent/jobs" onClick={closeMenu}>Jobs</Link></li>
                <li><Link to="/talent/opportunities" onClick={closeMenu}>Opportunities</Link></li>
              </ul>
            </li>

            <li><Link to="/blog" onClick={closeMenu}>Blogs</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

            <li className="search-icon-li">
              <button
                className="search-icon-btn"
                onClick={() => { setSearchOpen(true); closeMenu(); }}
                aria-label="Open search"
              >
                🔍
              </button>
            </li>

            <li className="take-course-li">
              <Link to="/courses" className="take-course-btn" onClick={closeMenu}>
                TAKE A COURSE
              </Link>
            </li>

          </ul>

        </div>
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

export default Navbar;
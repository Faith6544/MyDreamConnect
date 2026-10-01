import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';

// Helper to format price in Naira
const formatPrice = (course) => {
  if (!course.price || course.price === 0) return 'Free';
  return `₦${course.price.toLocaleString('en-NG')}`;
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetch('https://staging.mydreamconnect.org.ng/wp-json/learnpress/v1/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Courses...</h2>;
  }

  return (
    <div className="courses-page">

      <h1 className="courses-title">All Courses</h1>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="newest">Newly published</option>
          <option value="oldest">Oldest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Course Grid */}
      <div className="courses-grid">
        {sortedCourses.map(course => (
          <div className="course-card" key={course.id}>

            {/* Image */}
            <div className="course-image">
              <img src={course.image} alt="" />
              {course.price === 0 && <span className="badge-free">FREE</span>}
              {course.price > 0 && <span className="badge-paid">PAID</span>}
            </div>

            {/* Content */}
            <div className="course-content">

              <div className="course-categories">
                {course.categories && course.categories.length > 0
                  ? course.categories.map(cat => cat.name).join(', ')
                  : 'General'}
              </div>

              <h3 className="course-title">{course.name}</h3>

              <p className="course-excerpt">
                {course.excerpt
                  ? course.excerpt.replace(/<[^>]+>/g, '').substring(0, 90) + '...'
                  : 'Click to view full course description and enroll today.'}
              </p>

              <div className="course-meta">
                <span>🕐 {course.duration}</span>
                <span>📚 23 Lessons</span>
              </div>

              <div className="course-footer">
                <span className="course-price">{formatPrice(course)}</span>
                <Link to={`/courses/${course.id}`} className="buy-btn">
                  {course.price === 0 ? 'Enroll Now' : 'Buy Now'}
                </Link>
              </div>

            </div>

          </div>
        ))}
      </div>

      {sortedCourses.length === 0 && (
        <p style={{ textAlign: 'center', padding: '50px' }}>No courses found.</p>
      )}

    </div>
  );
}

export default Courses;
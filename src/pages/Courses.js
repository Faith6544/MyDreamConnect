import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

// `courses.price` is nullable and may come back as a numeric string.
const toPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatPrice = (course) => {
  const price = toPrice(course.price);
  if (price <= 0) return 'Free';
  return `₦${price.toLocaleString('en-NG')}`;
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetchAll = async () => {
      // 1. Fetch courses WITHOUT the join
      const { data: coursesData, error: coursesErr } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesErr) console.error("Courses Error:", coursesErr);

      // 2. Fetch categories separately
      const { data: catsData, error: catsErr } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (catsErr) console.error("Categories Error:", catsErr);

      // 3. Map them together in JavaScript
      const catMap = {};
      (catsData || []).forEach(c => { catMap[c.id] = c; });

      const formattedCourses = (coursesData || []).map(course => ({
        ...course,
        categories: catMap[course.category_id] || null
      }));

      setCourses(formattedCourses);
      setCategories(catsData || []);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const filteredCourses = courses.filter(c => {
    const name = (c.name || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const matchesCat =
      filterCategory === 'all' ||
      String(c.category_id) === String(filterCategory);
    return matchesSearch && matchesCat;
  });

  const safeTime = (value) => {
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') return safeTime(b.created_at) - safeTime(a.created_at);
    if (sortBy === 'oldest') return safeTime(a.created_at) - safeTime(b.created_at);
    if (sortBy === 'price-low') return toPrice(a.price) - toPrice(b.price);
    if (sortBy === 'price-high') return toPrice(b.price) - toPrice(a.price);
    return 0;
  });

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Courses...</h2>;
  }

  return (
    <div className="courses-page">
      <div className="courses-container">
        
        <h1 className="courses-title">All Courses</h1>

        <div className="filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="sort-select"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newly published</option>
            <option value="oldest">Oldest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="courses-grid">
          {sortedCourses.map(course => {
            const price = toPrice(course.price);
            const isFree = price <= 0;
            return (
              <div className="course-card" key={course.id}>
                <div className="course-image">
                  <ImageWithFallback
                    src={course.image_url}
                    alt={course.name ? `${course.name} course` : 'Course'}
                  />
                  {isFree ? (
                    <span className="badge-free">FREE</span>
                  ) : (
                    <span className="badge-paid">PAID</span>
                  )}
                </div>

                <div className="course-content">
                  <div className="course-categories">
                    {course.categories?.name || 'General'}
                  </div>
                  <h3 className="course-title">{course.name || 'Untitled Course'}</h3>
                  <p className="course-excerpt">
                    {course.excerpt
                      ? course.excerpt.substring(0, 90) + '...'
                      : 'Click to view full course description and enroll today.'}
                  </p>
                  <div className="course-meta">
                    <span>🕐 {course.duration || 'Flexible'}</span>
                  </div>
                  <div className="course-footer">
                    <span className="course-price">{formatPrice(course)}</span>
                    <Link to={`/courses/${course.id}`} className="buy-btn">
                      {isFree ? 'Enroll Now' : 'Buy Now'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedCourses.length === 0 && (
          <p style={{ textAlign: 'center', padding: '50px' }}>No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
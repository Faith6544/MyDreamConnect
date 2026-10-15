import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

const formatPrice = (course) => {
  if (!course.price || course.price === 0) return 'Free';
  return `₦${course.price.toLocaleString('en-NG')}`;
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
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false });

      const { data: catsData } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      setCourses(coursesData || []);
      setCategories(catsData || []);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      filterCategory === 'all' ||
      String(c.category_id) === String(filterCategory);
    return matchesSearch && matchesCat;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Courses...</h2>;
  }

  return (
    <div className="courses-page">
      <h1 className="courses-title">All Courses</h1>

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
        {sortedCourses.map(course => (
          <div className="course-card" key={course.id}>
            <div className="course-image">
              <ImageWithFallback src={course.image_url} alt="" />
              {course.price === 0 && <span className="badge-free">FREE</span>}
              {course.price > 0 && <span className="badge-paid">PAID</span>}
            </div>

            <div className="course-content">
              <div className="course-categories">
                {course.categories?.name || 'General'}
              </div>
              <h3 className="course-title">{course.name}</h3>
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
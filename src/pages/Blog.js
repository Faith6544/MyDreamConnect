import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchAll = async () => {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: catsData } = await supabase
        .from('post_categories')
        .select('*')
        .order('order_index', { ascending: true });

      const catMap = {};
      (catsData || []).forEach(c => { catMap[c.id] = c; });

      const postsWithCat = (postsData || []).map(p => ({
        ...p,
        category: catMap[p.category_id] || null,
      }));

      setPosts(postsWithCat);
      setCategories(catsData || []);
      setLoading(false);
    };

    fetchAll();
  }, []);

  // --- FIXED FILTERING LOGIC ---
  const filteredPosts = posts.filter(p => {
    if (filterCategory === 'all') return true;

    const isMatch = String(p.category_id) === String(filterCategory);
    const currentCat = categories.find(c => String(c.id) === String(filterCategory));
    
    // If the user clicked "Blogs" or "Uncategorized", also show posts with no category_id
    const isBlogsCategory = currentCat && currentCat.name.toLowerCase().includes('blog');
    const isUncategorized = p.category_id === null || p.category_id === undefined;

    if (isBlogsCategory && isUncategorized) {
      return true;
    }

    return isMatch;
  });

  const handleCategoryChange = (catId) => {
    setFilterCategory(catId);
    setCurrentPage(1); 
  };

  // Pagination Calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Blogs...</h2>;

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Latest From Our Blogs</h1>
        <p>Insights, stories, and updates from MyDreamConnect.</p>
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="blog-filters">
          <button
            className={filterCategory === 'all' ? 'blog-pill active' : 'blog-pill'}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              className={filterCategory === String(c.id) ? 'blog-pill active' : 'blog-pill'}
              onClick={() => handleCategoryChange(String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      <div className="blog-grid">
        {currentPosts.map(post => {
          const featuredImage = post.image_url || null;
          const date = new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          const title = post.title || 'Untitled';
          const excerpt = post.excerpt
            ? post.excerpt.substring(0, 110) + '...'
            : post.content
              ? post.content.replace(/<[^>]+>/g, '').substring(0, 110) + '...'
              : 'Read more...';

          return (
            <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
              <div className="blog-image">
                <ImageWithFallback src={featuredImage} alt={title} />
              </div>
              <div className="blog-content">
                <div className="blog-date">{date}</div>
                <h3>{title}</h3>
                <p>{excerpt}</p>
                <div className="blog-meta">
                  {/* Show the real category name, or default to Blogs */}
                  <span>📂 {post.category?.name || 'Blogs'}</span>
                  <span>🕐 3 min read</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <p style={{ textAlign: 'center', padding: '50px' }}>No posts in this category yet.</p>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="blog-pagination">
          <button 
            className="page-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          <button 
            className="page-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}

    </div>
  );
}

export default Blog;

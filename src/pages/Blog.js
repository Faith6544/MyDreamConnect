import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://staging.mydreamconnect.org.ng/wp-json/wp/v2/posts?_embed')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Blogs...</h2>;

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Latest From Our Blogs</h1>
        <p>Insights, stories, and updates from MyDreamConnect.</p>
      </div>

      <div className="blog-grid">
        {posts.map(post => {
          // Get featured image from embedded data
          const featuredImage = post._embedded && post._embedded['wp:featuredmedia']
            ? post._embedded['wp:featuredmedia'][0].source_url
            : 'https://via.placeholder.com/600x400?text=No+Image';

          // Format the date
          const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });

          // Strip HTML from title and excerpt
          const title = post.title.rendered.replace(/<[^>]+>/g, '');
          const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 110) + '...';

          return (
            <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={featuredImage} alt={title} />
              </div>
              <div className="blog-content">
                <div className="blog-date">{date}</div>
                <h3>{title}</h3>
                <p>{excerpt}</p>
                <div className="blog-meta">
                  <span>📂 Blogs</span>
                  <span>💬 0</span>
                  <span>🕐 3 min read</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p style={{ textAlign: 'center', padding: '50px' }}>No blog posts yet.</p>
      )}
    </div>
  );
}

export default Blog;
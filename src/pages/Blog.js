import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading Blogs...</h2>;
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Latest From Our Blogs</h1>
        <p>Insights, stories, and updates from MyDreamConnect.</p>
      </div>

      <div className="blog-grid">
        {posts.map(post => {
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
                <ImageWithFallback src={post.image_url} alt={title} />
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
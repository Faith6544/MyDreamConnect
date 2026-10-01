import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';
import Sidebar from '../components/Sidebar';
function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the single post
  useEffect(() => {
fetch(`${process.env.REACT_APP_WP_API}/wp/v2/posts/${id}?_embed`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading post:', err);
        setError('Could not load this post.');
        setLoading(false);
      });
  }, [id]);

  // Fetch related posts (latest 4, excluding this one)
  useEffect(() => {
fetch(`${process.env.REACT_APP_WP_API}/wp/v2/posts?per_page=5&_embed`)
      .then(res => res.json())
      .then(data => {
        const others = data.filter(p => String(p.id) !== String(id)).slice(0, 4);
        setRelated(others);
      })
      .catch(err => console.error('Error loading related:', err));
  }, [id]);

  if (loading) return <h2 className="bp-status">Loading post...</h2>;
  if (error) return <h2 className="bp-status">{error}</h2>;
  if (!post) return <h2 className="bp-status">Post not found.</h2>;

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    || 'https://via.placeholder.com/1200x600?text=No+Image';

  const author = post._embedded?.author?.[0]?.name || 'MyDreamConnect';
  const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'];

  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const title = post.title?.rendered?.replace(/<[^>]+>/g, '') || '';

  return (
    <div className="bp-page">

      {/* Banner */}
      <section className="bp-banner">
        <p className="bp-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / {title}
        </p>
        <h1>{title}</h1>
        <div className="bp-meta">
          <span>📅 {date}</span>
          <span>✍️ {author}</span>
          {categories.length > 0 && (
            <span>
              📂 {categories.map(c => c.name).join(', ')}
            </span>
          )}
        </div>
      </section>

      <div className="bp-layout">

        {/* ============ LEFT: Content ============ */}
        <article className="bp-content">

          {/* Featured image */}
          <figure className="bp-cover">
            <img src={featuredImage} alt="" />
          </figure>

          {/* Author card */}
          <div className="bp-author-card">
            {authorAvatar && <img src={authorAvatar} alt="" />}
            <div>
              <small>Written by</small>
              <h4>{author}</h4>
            </div>
          </div>

          {/* Content */}
          <div
            className="bp-body"
            dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="bp-tags">
              <strong>Tags:</strong>{' '}
              {tags.map(t => (
                <span className="bp-tag" key={t.id}>#{t.name}</span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="bp-back">
            <Link to="/blog">← Back to all blog posts</Link>
          </div>

        </article>

        {/* ============ RIGHT: Sidebar ============ */}
        <sidebar className="bp-sidebar">

          <div className="widget">
            <h3>Search</h3>
            <form className="sidebar-search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="" />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="widget">
            <h3>Recent Posts</h3>
            <ul className="widget-list">
              {related.map(p => (
                <li key={p.id}>
                  <Link to={`/blog/${p.id}`}>
                    {p.title?.rendered?.replace(/<[^>]+>/g, '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="widget">
            <h3>Categories</h3>
            <ul className="widget-list">
              <li><Link to="/blog">Blogs</Link></li>
              <li><Link to="/blog">Digital Information</Link></li>
              <li><Link to="/blog">Health &amp; Wellness</Link></li>
              <li><Link to="/blog">News &amp; Events</Link></li>
              <li><Link to="/blog">OPPORTUNITIES FOR DEVELOPMENT</Link></li>
              <li><Link to="/blog">Personal Development</Link></li>
            </ul>
          </div>

          <div className="widget">
            <h3>Subscribe</h3>
            <form className="sidebar-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Enter your name" />
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </sidebar>

      </div>

      {/* ============ RELATED POSTS ============ */}
      {related.length > 0 && (
        <section className="bp-related">
          <h2>You May Also Like</h2>
          <div className="bp-related-grid">
            {related.map(p => {
              const rImage = p._embedded?.['wp:featuredmedia']?.[0]?.source_url
                || 'https://via.placeholder.com/600x400?text=No+Image';
              const rDate = new Date(p.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              const rTitle = p.title?.rendered?.replace(/<[^>]+>/g, '') || '';
              return (
                <Link to={`/blog/${p.id}`} className="bp-related-card" key={p.id}>
                  <img src={rImage} alt="" />
                  <div>
                    <small>{rDate}</small>
                    <h3>{rTitle}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}

export default BlogPost;
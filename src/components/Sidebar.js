import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ showComments = false, showSubscribe = true }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.REACT_APP_WP_API;

    Promise.all([
      fetch(`${API}/wp/v2/posts?per_page=5&_embed`).then(r => r.json()),
      fetch(`${API}/wp/v2/categories?per_page=20&hide_empty=true`).then(r => r.json()),
    ])
      .then(([postsData, categoriesData]) => {
        const safePosts = Array.isArray(postsData) ? postsData : [];
        const safeCats = Array.isArray(categoriesData) ? categoriesData : [];

        setPosts(safePosts.slice(0, 5));
        setCategories(safeCats);

        // Build archives from post dates
        const monthNames = [
          'January','February','March','April','May','June',
          'July','August','September','October','November','December'
        ];
        const archiveMap = {};
        safePosts.forEach(p => {
          const d = new Date(p.date);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          archiveMap[key] = (archiveMap[key] || 0) + 1;
        });
        const archiveList = Object.keys(archiveMap).map(k => ({
          label: k,
          count: archiveMap[k],
        }));
        setArchives(archiveList);

        setLoading(false);
      })
      .catch(err => {
        console.error('Sidebar fetch error:', err);
        setLoading(false);
      });
  }, []);

  const stripHtml = (html = '') => html.replace(/<[^>]+>/g, '');

  return (
    <aside className="sidebar">

      {/* Search */}
      <div className="widget">
        <h3>Search</h3>
        <form className="sidebar-search" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="" />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Recent Posts */}
      <div className="widget">
        <h3>Recent Posts</h3>
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="widget-loading">No posts yet.</p>
        ) : (
          <ul className="widget-list">
            {posts.map(p => (
              <li key={p.id}>
                <Link to={`/blog/${p.id}`}>{stripHtml(p.title.rendered)}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Comments (optional) */}
      {showComments && (
        <div className="widget">
          <h3>Recent Comments</h3>
          <p className="widget-loading">Comments coming soon.</p>
        </div>
      )}

      {/* Archives */}
      <div className="widget">
        <h3>Archives</h3>
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : archives.length === 0 ? (
          <p className="widget-loading">No archives yet.</p>
        ) : (
          <ul className="widget-list">
            {archives.map((a, i) => (
              <li key={i}>
                <Link to="/blog">{a.label} ({a.count})</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Categories */}
      <div className="widget">
        <h3>Categories</h3>
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="widget-loading">No categories yet.</p>
        ) : (
          <ul className="widget-list">
            {categories.map(c => (
              <li key={c.id}>
                <Link to="/blog">{c.name} ({c.count})</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subscribe */}
      {showSubscribe && (
        <div className="widget">
          <h3>Subscribe</h3>
          <form className="sidebar-subscribe" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Enter your name" />
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      )}

    </aside>
  );
}

export default Sidebar;
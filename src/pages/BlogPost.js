import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';
import Sidebar from '../components/Sidebar';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the single post
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading post:', error);
        setError('Could not load this post.');
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  // Fetch related posts (latest 4, excluding this one)
  useEffect(() => {
    const fetchRelated = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error loading related:', error);
      } else {
        setRelated(data || []);
      }
    };

    fetchRelated();
  }, [id]);

  if (loading) return <h2 className="bp-status">Loading post...</h2>;
  if (error) return <h2 className="bp-status">{error}</h2>;
  if (!post) return <h2 className="bp-status">Post not found.</h2>;

  const featuredImage = post.image_url || null;
  const author = 'MyDreamConnect';
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const title = post.title || 'Untitled';

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
        </div>
      </section>

      <div className="bp-layout">

        {/* ============ LEFT: Content ============ */}
        <article className="bp-content">

          <figure className="bp-cover">
            <ImageWithFallback src={featuredImage} alt="" />
          </figure>

          {/* Author card */}
          <div className="bp-author-card">
            <div>
              <small>Written by</small>
              <h4>{author}</h4>
            </div>
          </div>

          {/* Content — plain text for now; use dangerouslySetInnerHTML if you store HTML */}
          <div className="bp-body">
            {post.content || ''}
          </div>

          <div className="bp-back">
            <Link to="/blog">← Back to all blog posts</Link>
          </div>

        </article>

        {/* ============ RIGHT: Sidebar ============ */}
        <Sidebar />

      </div>

      {/* ============ RELATED POSTS ============ */}
      {related.length > 0 && (
        <section className="bp-related">
          <h2>You May Also Like</h2>
          <div className="bp-related-grid">
            {related.map(p => {
              const rImage = p.image_url || null;
              const rDate = new Date(p.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              const rTitle = p.title || 'Untitled';
              return (
                <Link to={`/blog/${p.id}`} className="bp-related-card" key={p.id}>
                  <ImageWithFallback src={rImage} alt="" />
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
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';
import Sidebar from '../components/Sidebar';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth(); 
  
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: postData, error: postErr } = await supabase
        .from('posts').select('*').eq('id', id).single();
      if (postErr) setError('Could not load this post.');
      else setPost(postData);

      const { data: relatedData } = await supabase
        .from('posts').select('*').neq('id', id).order('created_at', { ascending: false }).limit(3);
      setRelated(relatedData || []);

      const { data: tagsData } = await supabase
        .from('post_tag_links').select('post_tags(name)').eq('post_id', id);
      setTags((tagsData || []).map(l => l.post_tags).filter(Boolean));

      const { data: commentsData } = await supabase
        .from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true });
      setComments(commentsData || []);

      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const displayName = user.user_metadata?.full_name || user.email.split('@')[0];

    const { error: insertErr } = await supabase.from('comments').insert([{
      post_id: id,
      user_id: user.id,
      author_name: displayName,
      content: newComment.trim()
    }]);

    if (insertErr) {
      alert("Failed to post comment: " + insertErr.message);
    } else {
      setNewComment('');
      const { data } = await supabase
        .from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true });
      setComments(data || []);
    }
    setSubmitting(false);
  };

  if (loading) return <h2 className="bp-status">Loading post...</h2>;
  if (error) return <h2 className="bp-status">{error}</h2>;
  if (!post) return <h2 className="bp-status">Post not found.</h2>;

  const author = 'MyDreamConnect';
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const title = post.title || 'Untitled';

  return (
    <div className="bp-page">
      <div className="bp-container">
        
        <header className="bp-header">
          <p className="bp-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/blog">Blog</Link>
          </p>
          <h1>{title}</h1>
          <div className="bp-meta">
            <span>📅 {date}</span>
            <span>✍️ {author}</span>
          </div>
        </header>

        <div className="bp-layout">
          <article className="bp-content">
            
            <figure className="bp-cover">
              <ImageWithFallback src={post.image_url} alt={title} />
            </figure>

            {/* FIXED CONTENT RENDERING */}
            <div className="bp-body">
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {post.content || ''}
              </p>
            </div>

            {tags.length > 0 && (
              <div className="bp-tags">
                <strong>Tags:</strong>{' '}
                {tags.map(t => (
                  <span className="bp-tag" key={t.name}>#{t.name}</span>
                ))}
              </div>
            )}

            <section className="bp-comments-section">
              <h3>Comments ({comments.length})</h3>

              <div className="bp-comments-list">
                {comments.length === 0 ? (
                  <p className="bp-no-comments">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map(c => (
                    <div className="bp-comment" key={c.id}>
                      <div className="bp-comment-header">
                        <strong>{c.author_name}</strong>
                        <span className="bp-comment-date">
                          {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="bp-comment-text">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="bp-comment-form-wrapper">
                <h4>Leave a Reply</h4>
                {!user ? (
                  <p className="bp-login-prompt">
                    Please <Link to="/get-started">log in</Link> to leave a comment.
                  </p>
                ) : (
                  <form onSubmit={handleCommentSubmit} className="bp-comment-form">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      disabled={submitting}
                    />
                    <button type="submit" disabled={submitting}>
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                )}
              </div>
            </section>

            <div className="bp-back">
              <Link to="/blog">← Back to all blog posts</Link>
            </div>
          </article>

          <Sidebar />
        </div>

        {related.length > 0 && (
          <section className="bp-related">
            <h2>You May Also Like</h2>
            <div className="bp-related-grid">
              {related.map(p => {
                const rDate = new Date(p.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });
                return (
                  <Link to={`/blog/${p.id}`} className="bp-related-card" key={p.id}>
                    <ImageWithFallback src={p.image_url} alt={p.title} />
                    <div>
                      <small>{rDate}</small>
                      <h3>{p.title || 'Untitled'}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default BlogPost;
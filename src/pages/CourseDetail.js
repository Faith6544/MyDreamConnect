import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './CourseDetail.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: courseData, error: courseErr } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseErr) {
        setError('Could not load this course.');
        setLoading(false);
        return;
      }
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });
      setLessons(lessonsData || []);

      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        setEnrolled(!!enrollment);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setEnrolling(true);
    setError(null);

    const { error } = await supabase
      .from('enrollments')
      .insert([{ user_id: user.id, course_id: Number(id) }]);

    if (error) {
      setError('Enrollment failed: ' + error.message);
      setEnrolling(false);
      return;
    }

    setEnrolled(true);
    setEnrolling(false);
  };

  if (loading) return <h2 className="cd-status">Loading course...</h2>;
  if (error && !course) return <h2 className="cd-status">{error}</h2>;
  if (!course) return <h2 className="cd-status">Course not found.</h2>;

  const isFree = !course.price || course.price === 0;

  return (
    <div className="cd-page">
      <section className="cd-banner">
        <p className="cd-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / {course.name}
        </p>
        <h1>{course.name}</h1>
      </section>

      <div className="cd-layout">
        <article className="cd-content">
          <figure className="cd-cover">
            <ImageWithFallback src={course.image_url} alt={course.name} />
          </figure>

          <div className="cd-meta-bar">
            <div className="cd-meta-item">
              <span className="cd-meta-icon">🕐</span>
              <div>
                <small>Duration</small>
                <strong>{course.duration || 'Flexible'}</strong>
              </div>
            </div>
            <div className="cd-meta-item">
              <span className="cd-meta-icon">📚</span>
              <div>
                <small>Lessons</small>
                <strong>{lessons.length}</strong>
              </div>
            </div>
            <div className="cd-meta-item">
              <span className="cd-meta-icon">📊</span>
              <div>
                <small>Level</small>
                <strong>{course.level || 'All Levels'}</strong>
              </div>
            </div>
          </div>

          <section className="cd-section">
            <h2>About This Course</h2>
            <p>{course.content || course.excerpt || 'No description yet.'}</p>
          </section>

          {lessons.length > 0 && (
            <section className="cd-section">
              <h2>Lessons</h2>
              <ul className="cd-lessons-preview">
                {lessons.map((l, i) => (
                  <li key={l.id}>
                    <span className="cd-lesson-num">{i + 1}</span>
                    <span>{l.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="cd-sidebar">
          <div className="cd-buy-card">
            <span className="cd-price-label">Course Price</span>
            <h2 className="cd-price">
              {isFree ? 'Free' : `₦${course.price.toLocaleString('en-NG')}`}
            </h2>

            {error && <p className="cd-buy-error">{error}</p>}

            {!user && (
              <>
                <button
                  className="cd-buy-btn"
                  onClick={() => navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } })}
                >
                  Sign in to Enroll
                </button>
                <p className="cd-buy-note">
                  You need an account to enroll in this course.
                </p>
              </>
            )}

            {user && !enrolled && isFree && (
              <>
                <button
                  className="cd-buy-btn"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
                <p className="cd-buy-note">
                  Instant access. No payment required.
                </p>
              </>
            )}

            {user && !enrolled && !isFree && (
              <>
                <button className="cd-buy-btn" disabled>
                  Buy Now
                </button>
                <p className="cd-buy-note">
                  🔒 Payment integration coming soon. Contact us to enroll.
                </p>
              </>
            )}

            {user && enrolled && (
              <>
                <div className="cd-enrolled-badge">✅ You're enrolled</div>
                <Link
                  to={`/my-courses/${course.id}`}
                  className="cd-buy-btn"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  Go to Course →
                </Link>
              </>
            )}

            <ul className="cd-buy-features">
              <li>✅ Lifetime access</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Learn from experts</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CourseDetail;
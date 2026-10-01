import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   fetch(`${process.env.REACT_APP_WP_API}/learnpress/v1/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading course:', err);
        setError('Could not load this course.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="cd-status">Loading course...</h2>;
  if (error) return <h2 className="cd-status">{error}</h2>;
  if (!course) return <h2 className="cd-status">Course not found.</h2>;

  const isFree = !course.price || course.price === 0;
  const students = course.count_students || 0;
  const lessons = course.meta_data?._lp_lesson_count || course.meta_data?._lp_offline_lesson_count || 0;
  const level = course.meta_data?._lp_level || 'all';

  return (
    <div className="cd-page">

      {/* Banner */}
      <section className="cd-banner">
        <p className="cd-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / {course.name}
        </p>
        <h1>{course.name}</h1>
      </section>

      <div className="cd-layout">

        {/* ============ LEFT: Course content ============ */}
        <article className="cd-content">

          {/* Cover image */}
          <figure className="cd-cover">
            <img
              src={course.image || 'https://via.placeholder.com/1200x600?text=Course'}
              alt={course.name}
            />
          </figure>

          {/* Meta bar */}
          <div className="cd-meta-bar">
            <div className="cd-meta-item">
              <span className="cd-meta-icon">🕐</span>
              <div>
                <small>Duration</small>
                <strong>{course.duration || 'Flexible'}</strong>
              </div>
            </div>
            <div className="cd-meta-item">
              <span className="cd-meta-icon">📊</span>
              <div>
                <small>Level</small>
                <strong>{level === 'all' ? 'All Levels' : level}</strong>
              </div>
            </div>
            <div className="cd-meta-item">
              <span className="cd-meta-icon">📚</span>
              <div>
                <small>Lessons</small>
                <strong>{lessons}</strong>
              </div>
            </div>
            <div className="cd-meta-item">
              <span className="cd-meta-icon">👥</span>
              <div>
                <small>Students</small>
                <strong>{students}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="cd-section">
            <h2>About This Course</h2>
            {course.excerpt ? (
              <div dangerouslySetInnerHTML={{ __html: course.excerpt }} />
            ) : (
              <p>
                This course is part of the MyDreamConnect learning program.
                For detailed information, please visit the course page on the
                official platform.
              </p>
            )}
          </section>

          {/* Instructor */}
          {course.instructor && (
            <section className="cd-section">
              <h2>Your Instructor</h2>
              <div className="cd-instructor">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                />
                <div>
                  <h3>{course.instructor.name}</h3>
                  {course.instructor.description ? (
                    <div dangerouslySetInnerHTML={{ __html: course.instructor.description }} />
                  ) : (
                    <p>Instructor at MyDreamConnect.</p>
                  )}
                </div>
              </div>
            </section>
          )}

        </article>

        {/* ============ RIGHT: Purchase card ============ */}
        <aside className="cd-sidebar">
          <div className="cd-buy-card">
            <span className="cd-price-label">
              {isFree ? 'Course Fee' : 'Course Price'}
            </span>
            <h2 className="cd-price">
              {isFree ? 'Free' : course.price_rendered}
            </h2>
            {course.on_sale && (
              <p className="cd-original-price">
                <s>{course.origin_price_rendered}</s>
              </p>
            )}

            <a
              href={course.permalink}
              target="_blank"
              rel="noreferrer"
              className="cd-buy-btn"
            >
              {isFree ? 'Enroll Now on WordPress' : 'Buy Now on WordPress'}
            </a>

            <p className="cd-buy-note">
              🔒 Secure. You will be redirected to our LearnPress platform
              to complete your enrollment.
            </p>

            <ul className="cd-buy-features">
              <li>✅ Lifetime access</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Learn from experts</li>
              <li>✅ Support community</li>
            </ul>
          </div>
        </aside>

      </div>

    </div>
  );
}

export default CourseDetail;
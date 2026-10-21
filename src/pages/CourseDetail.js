import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import './CourseDetail.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // SCHOLARSHIP CHECK
  const isScholarship = searchParams.get('scholarship') === 'approved_80';

  useEffect(() => {
    // ... (Keep your existing fetchData logic here) ...
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: courseData, error: courseErr } = await supabase
        .from('courses').select('*').eq('id', id).single();

      if (courseErr) { setError('Could not load this course.'); setLoading(false); return; }
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from('lesson_outline').select('id, title, order_index').eq('course_id', id).order('order_index', { ascending: true });
      setLessons(lessonsData || []);

      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments').select('id').eq('course_id', id).eq('user_id', user.id).maybeSingle();
        setEnrolled(!!enrollment);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  // ... (Keep your existing paystack/enrollment functions here) ...
  const handleEnrollFree = async () => {
    if (!user) { navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setProcessing(true);
    const { error } = await supabase.from('enrollments').insert([{ user_id: user.id, course_id: Number(id) }]);
    if (error) setError('Enrollment failed: ' + error.message);
    else setEnrolled(true);
    setProcessing(false);
  };

  const handlePaystackCheckout = async () => {
    if (!user) { navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const callbackUrl = `${window.location.origin}/courses/${id}?course_id=${id}`;
      
      // CALCULATE FINAL PRICE
      const finalPrice = isScholarship ? course.price * 0.2 : course.price;

      const response = await fetch('https://kzdqbqnyytgovlngfvwr.supabase.co/functions/v1/initialize-paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ email: user.email, amount: finalPrice, course_id: course.id, callback_url: callbackUrl }),
      });

      const data = await response.json();
      if (!response.ok || !data.authorization_url) throw new Error(data.error || "Payment failed");
      window.location.href = data.authorization_url;

    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading) return <h2 className="cd-status">Loading course...</h2>;
  if (error && !course) return <h2 className="cd-status">{error}</h2>;
  if (!course) return <h2 className="cd-status">Course not found.</h2>;

  const isFree = !course.price || course.price === 0;
  
  // CALCULATE DISPLAY PRICE
  const displayPrice = isScholarship ? course.price * 0.2 : course.price;

  return (
    <div className="cd-page">
      <div className="cd-container">
        {/* ... Keep your existing header and main content here ... */}
        <header className="cd-header">
          <p className="cd-breadcrumb"><Link to="/">Home</Link> / <Link to="/courses">Courses</Link></p>
          <h1>{course.name}</h1>
        </header>

        <div className="cd-layout">
          <article className="cd-content">
             {/* ... Keep your existing image, meta, and lessons here ... */}
             <figure className="cd-cover"><ImageWithFallback src={course.image_url} alt={course.name} /></figure>
             <section className="cd-section"><h2>About This Course</h2><p>{course.content || course.excerpt}</p></section>
          </article>

          <aside className="cd-sidebar">
            <div className="cd-buy-card">
              
              {/* SCHOLARSHIP BADGE */}
              {isScholarship && (
                <div className="scholarship-badge">
                  🎉 80% Scholarship Applied!
                </div>
              )}

              <div className="cd-price-header">
                <span className="cd-price-label">Course Price</span>
                {isScholarship ? (
                  <div>
                    <h2 className="cd-price" style={{ color: '#27ae60' }}>
                      ₦{displayPrice.toLocaleString('en-NG')}
                    </h2>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px' }}>
                      ₦{course.price.toLocaleString('en-NG')}
                    </span>
                  </div>
                ) : (
                  <h2 className="cd-price">{isFree ? 'Free' : `₦${course.price.toLocaleString('en-NG')}`}</h2>
                )}
              </div>

              <div className="cd-divider" />

              {error && <p className="cd-buy-error">{error}</p>}

              {!user && (
                <button className="cd-buy-btn" onClick={() => navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } })}>
                  Sign in to Enroll
                </button>
              )}

              {user && !enrolled && isFree && (
                <button className="cd-buy-btn" onClick={handleEnrollFree} disabled={processing}>
                  {processing ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
              )}

              {user && !enrolled && !isFree && (
                <button className="cd-buy-btn" onClick={handlePaystackCheckout} disabled={processing}>
                  {processing ? 'Processing...' : `Pay ₦${displayPrice.toLocaleString('en-NG')} with Paystack`}
                </button>
              )}

              {user && enrolled && (
                <>
                  <div className="cd-enrolled-badge">✅ You're enrolled</div>
                  <Link to={`/my-courses/${course.id}`} className="cd-buy-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                    Go to Course →
                  </Link>
                </>
              )}

              {/* SCHOLARSHIP LINK (Only shows if they haven't applied yet) */}
              {!isScholarship && !isFree && !enrolled && (
                <Link to={`/scholarship?course_id=${course.id}`} className="scholarship-apply-link">
                  Can't afford this? Apply for an 80% Scholarship →
                </Link>
              )}

              <p className="cd-buy-note">🔒 Secure payment powered by Paystack</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import './CourseDetail.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const SUPABASE_FUNCTIONS_URL = process.env.REACT_APP_SUPABASE_URL;

const formatNaira = (value) => `₦${Number(value ?? 0).toLocaleString('en-NG')}`;

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  // Authoritative pricing comes from the server (see check-scholarship).
  // { price, amount, eligible } - `amount` is what the user actually pays.
  const [pricing, setPricing] = useState(null);
  const [paymentState, setPaymentState] = useState('idle'); // idle | verifying | done | failed

  // The scholarship magic link is only a HINT. The discount itself is granted
  // by the server after it verifies an approved scholarship_applications row.
  const scholarshipRequested = searchParams.get('scholarship') === 'approved_80';
  const paystackReference = searchParams.get('reference');

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: courseData, error: courseErr } = await supabase
        .from('courses').select('*').eq('id', id).single();

      if (courseErr) {
        if (!cancelled) { setError('Could not load this course.'); setLoading(false); }
        return;
      }
      if (cancelled) return;
      setCourse(courseData);

      // `lessons` is the table the app actually writes to (AdminLessonEditor).
      const { data: lessonsData, error: lessonsErr } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('course_id', id)
        .order('order_index', { ascending: true })
        .order('id', { ascending: true });
      if (lessonsErr) console.error('Could not load lessons:', lessonsErr);
      setLessons(lessonsData || []);

      // Always reset first so a signed-out visitor never sees stale state.
      setEnrolled(false);
      if (user) {
        // Use an array query: maybeSingle() errors out when duplicate rows
        // exist, which would make an enrolled student look unenrolled.
        const { data: enrollments, error: enrollErr } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', id)
          .eq('user_id', user.id)
          .limit(1);
        if (enrollErr) console.error('Enrollment check failed:', enrollErr);
        else setEnrolled((enrollments || []).length > 0);
      }

      if (!cancelled) setLoading(false);
    };

    fetchData();
    return () => { cancelled = true; };
  }, [id, user]);

  // Ask the server what this visitor actually has to pay. The URL parameter
  // alone is never enough - it can be typed in by anyone.
  useEffect(() => {
    let cancelled = false;
    if (!user || !scholarshipRequested) return;

    const loadPricing = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/functions/v1/check-scholarship`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ course_id: Number(id) }),
        });

        const body = await response.json();
        if (cancelled) return;
        if (!response.ok) throw new Error(body.error || 'Could not verify scholarship');

        setPricing({ price: body.price, amount: body.amount, eligible: body.eligible });

        if (!body.eligible) {
          setNotice('This scholarship link is not valid for your account.');
        }
      } catch (err) {
        if (!cancelled) console.error('Scholarship check failed:', err);
      }
    };

    loadPricing();
    return () => { cancelled = true; };
  }, [id, user, scholarshipRequested]);

  // Paystack redirects back here with ?reference=...&status=success.
  // The enrollment for a paid course is created by the verify-paystack edge
  // function - it has to be called, otherwise the payment grants nothing.
  useEffect(() => {
    let cancelled = false;
    if (!paystackReference || !user) return;

    const verifyPayment = async () => {
      setPaymentState('verifying');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Please sign in to complete your payment.');

        const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/functions/v1/verify-paystack`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ reference: paystackReference, course_id: Number(id) }),
        });

        const body = await response.json();
        if (cancelled) return;
        if (!response.ok || !body.success) throw new Error(body.error || 'Payment verification failed');

        setPaymentState('done');
        setEnrolled(true);

        // Strip the payment params so a refresh does not re-verify.
        const clean = new URLSearchParams(searchParams);
        clean.delete('reference');
        clean.delete('status');
        navigate({ pathname: `/courses/${id}`, search: clean.toString() ? `?${clean.toString()}` : '' }, { replace: true });
      } catch (err) {
        if (cancelled) return;
        setPaymentState('failed');
        setError(err.message);
      }
    };

    verifyPayment();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paystackReference, id, user, navigate]);

  const handleEnrollFree = async () => {
    if (!user) { navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setProcessing(true);
    setError(null);

    const { error: insertError } = await supabase.from('enrollments').insert([
      { user_id: user.id, course_id: Number(id), enrolled_at: new Date().toISOString() },
    ]);

    // 23505 = unique_violation: the student is already enrolled, which is a
    // success from the user's point of view.
    if (insertError && insertError.code !== '23505') {
      setError('Enrollment failed: ' + insertError.message);
    } else {
      setEnrolled(true);
    }
    setProcessing(false);
  };

  const handlePaystackCheckout = async () => {
    if (!user) { navigate('/get-started', { state: { from: { pathname: `/courses/${id}` } } }); return; }
    setProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const callbackUrl = `${window.location.origin}/courses/${id}`;

      // NOTE: the amount is deliberately NOT sent from the client. The edge
      // function looks up the course price and applies the scholarship based
      // on the database, so a tampered client cannot pay less.
      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/functions/v1/initialize-paystack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ course_id: Number(id), callback_url: callbackUrl }),
      });

      const data = await response.json();
      if (!response.ok || !data.authorization_url) throw new Error(data.error || 'Payment failed');
      window.location.href = data.authorization_url;

    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading) return <h2 className="cd-status">Loading course...</h2>;
  if (error && !course) return <h2 className="cd-status">{error}</h2>;
  if (!course) return <h2 className="cd-status">Course not found.</h2>;

  const price = Number(course.price ?? 0);
  const isFree = price === 0;

  // Server-authoritative amounts. Fall back to the raw price until (and if)
  // the scholarship check comes back.
  const isScholarship = Boolean(pricing?.eligible);
  const displayPrice = pricing?.amount ?? price;

  return (
    <div className="cd-page">
      <div className="cd-container">
        <header className="cd-header">
          <p className="cd-breadcrumb"><Link to="/">Home</Link> / <Link to="/courses">Courses</Link></p>
          <h1>{course.name}</h1>
        </header>

        <div className="cd-layout">
          <article className="cd-content">
            <figure className="cd-cover"><ImageWithFallback src={course.image_url} alt={course.name} /></figure>

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
                <span className="cd-meta-icon">🎯</span>
                <div>
                  <small>Level</small>
                  <strong>{course.level || 'All Levels'}</strong>
                </div>
              </div>
            </div>

            <section className="cd-section">
              <h2>About This Course</h2>
              <p>{course.content || course.excerpt}</p>
            </section>

            {lessons.length > 0 && (
              <section className="cd-section">
                <h2>What You Will Learn</h2>
                <ul className="cd-lessons-preview">
                  {lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <span className="cd-lesson-num">{index + 1}</span>
                      <span>{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <aside className="cd-sidebar">
            <div className="cd-buy-card">

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
                      {formatNaira(displayPrice)}
                    </h2>
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px' }}>
                      {formatNaira(price)}
                    </span>
                  </div>
                ) : (
                  <h2 className="cd-price">{isFree ? 'Free' : formatNaira(price)}</h2>
                )}
              </div>

              <div className="cd-divider" />

              {error && <p className="cd-buy-error">{error}</p>}
              {notice && <p className="cd-buy-note">{notice}</p>}

              {paymentState === 'verifying' && (
                <p className="cd-buy-note">Verifying your payment...</p>
              )}

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
                <button className="cd-buy-btn" onClick={handlePaystackCheckout} disabled={processing || paymentState === 'verifying'}>
                  {processing ? 'Processing...' : `Pay ${formatNaira(displayPrice)} with Paystack`}
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

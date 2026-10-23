import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { downloadCertificate } from '../lib/certificate';
import './MyCoursePlayer.css';

function extractYouTubeId(url = '') {
  try {
    // youtu.be/ID
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?#]/)[0];
      return id || null;
    }
    // youtube.com/watch?v=ID
    if (url.includes('watch')) {
      const match = url.match(/[?&]v=([^&#]+)/);
      if (match) return match[1];
    }
    // youtube.com/embed/ID or /shorts/ID
    const match = url.match(/(?:embed|shorts)\/([^?#/]+)/);
    if (match) return match[1];
    // fallback: last path segment if it looks like an id
    const parts = url.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[A-Za-z0-9_-]{11}$/.test(last.split(/[?#]/)[0])) {
      return last.split(/[?#]/)[0];
    }
  } catch {
    // ignore
  }
  return null;
}

function MyCoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [certificate, setCertificate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // If there is no user yet, wait - AuthContext still loading in some
      // flows. Only redirect/abort once we know the user state.
      if (user === undefined) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      // Check enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (!enrollment) {
        navigate(`/courses/${id}`);
        return;
      }

      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (cancelled) return;
      setCourse(courseData || null);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true })
        .order('id', { ascending: true });
      if (cancelled) return;
      const loadedLessons = lessonsData || [];
      setLessons(loadedLessons);

      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('course_id', id)
        .eq('user_id', user.id);
      if (cancelled) return;

      const completedList = (progressData || []).map(p => p.lesson_id);
      setCompletedIds(new Set(completedList));

      // Check for 100% completion → load or create certificate
      const allIds = loadedLessons.map(l => l.id);
      const isComplete =
        allIds.length > 0 &&
        allIds.every(lid => completedList.includes(lid));

      if (isComplete) {
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .maybeSingle();

        if (cancelled) return;

        if (certData) {
          setCertificate(certData);
        } else {
          const { data: newCert, error: certError } = await supabase
            .from('certificates')
            .insert([{ user_id: user.id, course_id: Number(id), issued_at: new Date().toISOString() }])
            .select()
            .single();

          if (cancelled) return;
          if (!certError) {
            setCertificate(newCert);
          }
        }
      }

      if (!cancelled) setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [id, user, navigate]);

  const toggleComplete = async (lessonId) => {
    if (!user || saving) return;

    setSaving(true);
    setError(null);

    const isDone = completedIds.has(lessonId);
    const next = new Set(completedIds);

    if (isDone) {
      const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
      } else {
        next.delete(lessonId);
        setCompletedIds(next);
        // If they un-complete, delete and remove certificate so the UI stays
        // consistent with "100% complete" requirements.
        if (certificate?.id) {
          const { error: certDelError } = await supabase
            .from('certificates')
            .delete()
            .eq('id', certificate.id)
            .eq('user_id', user.id);
          if (certDelError) {
            setError(certDelError.message);
          }
        }
        setCertificate(null);
      }
    } else {
      const { error } = await supabase
        .from('lesson_progress')
        .insert([{
          user_id: user.id,
          lesson_id: lessonId,
          course_id: Number(id),
        }]);

      if (error) {
        setError(error.message);
      } else {
        next.add(lessonId);
        setCompletedIds(next);

        // If this marks the course 100% complete, create certificate
        const allIds = lessons.map(l => l.id);
        const nowComplete = allIds.length > 0 && allIds.every(lid => next.has(lid));

        if (nowComplete && !certificate) {
          const { data: existing } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', id)
            .maybeSingle();

          if (existing) {
            setCertificate(existing);
          } else {
            const { data: newCert, error: certError } = await supabase
              .from('certificates')
              .insert([{ user_id: user.id, course_id: Number(id), issued_at: new Date().toISOString() }])
              .select()
              .single();

            if (certError) {
              setError(certError.message);
            } else {
              setCertificate(newCert);
            }
          }
        }
      }
    }

    setSaving(false);
  };

  const handleDownloadCertificate = () => {
    downloadCertificate({
      studentName:
        user?.user_metadata?.full_name ||
        user?.email?.split('@')[0] ||
        'Student',
      courseName: course?.name || 'Course',
      issuedDate: new Date(certificate?.issued_at || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      certificateId: certificate?.id || 'PENDING',
    });
  };

  if (loading) return <h2 className="mcp-status">Loading course...</h2>;
  if (!user) return <h2 className="mcp-status">Please sign in to view your course.</h2>;
  if (!course) return <h2 className="mcp-status">Course not found.</h2>;
  if (lessons.length === 0) {
    return (
      <div className="mcp-page">
        <div className="mcp-empty">
          <h2>This course has no lessons yet</h2>
          <p>Check back soon — the instructor is still adding content.</p>
          <Link to="/my-courses" className="mcp-btn">← Back to My Courses</Link>
        </div>
      </div>
    );
  }

  // Clamp the active index in case lessons were reordered/deleted while open.
  const safeIndex = Math.min(Math.max(activeIndex, 0), lessons.length - 1);
  const activeLesson = lessons[safeIndex];
  const completed = completedIds.size;
  const percent = Math.min(100, Math.round((completed / lessons.length) * 100));
  const isActiveDone = completedIds.has(activeLesson.id);

  return (
    <div className="mcp-page">

      <header className="mcp-header">
        <div className="mcp-header-top">
          <Link to="/my-courses" className="mcp-back">← My Courses</Link>
          <h1>{course.name || 'Course'}</h1>
        </div>
        <div className="mcp-progress-wrap">
          <div className="mcp-progress-bar">
            <div className="mcp-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="mcp-progress-text">
            {completed} of {lessons.length} lessons · {percent}%
          </span>
        </div>
      </header>

      {certificate && (
        <div className="mcp-certificate">
          <div className="mcp-cert-icon">🎓</div>
          <div className="mcp-cert-text">
            <h3>Congratulations! You completed this course.</h3>
            <p>Your certificate of completion is ready to download.</p>
          </div>
          <button className="mcp-cert-btn" onClick={handleDownloadCertificate}>
            ⬇ Download Certificate
          </button>
        </div>
      )}

      <div className="mcp-layout">

        {/* Sidebar — lesson list */}
        <aside className="mcp-sidebar">
          <h3>Lessons</h3>
          <ul className="mcp-lesson-list">
            {lessons.map((l, i) => {
              const done = completedIds.has(l.id);
              const active = i === safeIndex;
              return (
                <li
                  key={l.id}
                  className={`mcp-lesson-item ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                  onClick={() => setActiveIndex(i)}
                >
                  <span className="mcp-lesson-check">{done ? '✅' : '⭕'}</span>
                  <span className="mcp-lesson-title">
                    <small>Lesson {i + 1}</small>
                    {l.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main — active lesson */}
        <main className="mcp-main">
          <div className="mcp-lesson-head">
            <small>Lesson {safeIndex + 1} of {lessons.length}</small>
            <h2>{activeLesson.title}</h2>
          </div>

          {/* MULTIPLE YOUTUBE VIDEOS SECTION */}
          {Array.isArray(activeLesson.video_urls) && activeLesson.video_urls.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              {activeLesson.video_urls.map((url, index) => {
                if (!url || typeof url !== 'string') return null;
                const videoId = extractYouTubeId(url);
                if (!videoId) return null;

                return (
                  <div key={`${url}-${index}`} className="mcp-video" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Lesson Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mcp-lesson-content">
            {activeLesson.content ? (
              <p style={{ whiteSpace: 'pre-wrap' }}>{activeLesson.content}</p>
            ) : (
              <p style={{ color: '#888' }}>No written content for this lesson.</p>
            )}
          </div>

          {error && <div className="mcp-error">❌ {error}</div>}

          <div className="mcp-actions">
            <button
              className="mcp-nav-btn"
              onClick={() => setActiveIndex(Math.max(0, safeIndex - 1))}
              disabled={safeIndex === 0}
            >
              ← Previous
            </button>

            <button
              className={`mcp-complete-btn ${isActiveDone ? 'done' : ''}`}
              onClick={() => toggleComplete(activeLesson.id)}
              disabled={saving}
            >
              {saving ? 'Saving...' : isActiveDone ? '✅ Mark as Incomplete' : 'Mark as Complete'}
            </button>

            <button
              className="mcp-nav-btn"
              onClick={() => setActiveIndex(Math.min(lessons.length - 1, safeIndex + 1))}
              disabled={safeIndex === lessons.length - 1}
            >
              Next →
            </button>
          </div>
        </main>

      </div>
    </div>
  );
}

export default MyCoursePlayer;

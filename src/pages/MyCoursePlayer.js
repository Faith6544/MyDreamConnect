import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './MyCoursePlayer.css';

function MyCoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      // Check enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!enrollment) {
        navigate(`/courses/${id}`);
        return;
      }

      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });
      setLessons(lessonsData || []);

      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('course_id', id)
        .eq('user_id', user.id);

      setCompletedIds(new Set((progressData || []).map(p => p.lesson_id)));

      setLoading(false);
    };

    load();
  }, [id, user, navigate]);

  const toggleComplete = async (lessonId) => {
    if (!user || saving) return;

    setSaving(true);
    setError(null);

    const isDone = completedIds.has(lessonId);

    if (isDone) {
      const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
      } else {
        const next = new Set(completedIds);
        next.delete(lessonId);
        setCompletedIds(next);
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
        const next = new Set(completedIds);
        next.add(lessonId);
        setCompletedIds(next);
      }
    }

    setSaving(false);
  };

  if (loading) return <h2 className="mcp-status">Loading course...</h2>;
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

  const activeLesson = lessons[activeIndex];
  const completed = completedIds.size;
  const percent = Math.round((completed / lessons.length) * 100);
  const isActiveDone = completedIds.has(activeLesson.id);

  return (
    <div className="mcp-page">

      <header className="mcp-header">
        <div className="mcp-header-top">
          <Link to="/my-courses" className="mcp-back">← My Courses</Link>
          <h1>{course.name}</h1>
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

      <div className="mcp-layout">

        {/* Sidebar — lesson list */}
        <aside className="mcp-sidebar">
          <h3>Lessons</h3>
          <ul className="mcp-lesson-list">
            {lessons.map((l, i) => {
              const done = completedIds.has(l.id);
              const active = i === activeIndex;
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
            <small>Lesson {activeIndex + 1} of {lessons.length}</small>
            <h2>{activeLesson.title}</h2>
          </div>

          {activeLesson.video_url && (
            <div className="mcp-video">
              <iframe
                src={activeLesson.video_url}
                title={activeLesson.title}
                frameBorder="0"
                allowFullScreen
              />
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
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
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
              onClick={() => setActiveIndex(Math.min(lessons.length - 1, activeIndex + 1))}
              disabled={activeIndex === lessons.length - 1}
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
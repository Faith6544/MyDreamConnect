import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './MyCourses.css';

function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          course_id,
          courses:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (enr) => {
          const courseId = enr.course_id;

          const { count: totalLessons } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId);

          const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId)
            .eq('user_id', user.id);

          return {
            ...enr,
            totalLessons: totalLessons || 0,
            completedLessons: completedLessons || 0,
          };
        })
      );

      setEnrollments(enriched);
      setLoading(false);
    };

    fetchEnrollments();
  }, [user]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="mycourses-page">
      <section className="mycourses-banner">
        <h1>Welcome, {displayName} 👋</h1>
        <p>Your learning dashboard</p>
      </section>

      <section className="mycourses-content">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading your courses...</p>
        ) : enrollments.length === 0 ? (
          <div className="mycourses-empty">
            <h2>You're not enrolled in any courses yet</h2>
            <p>Browse our catalog and enroll to get started.</p>
            <Link to="/courses" className="mycourses-btn">Browse Courses →</Link>
          </div>
        ) : (
          <>
            <h2 className="mycourses-heading">My Courses ({enrollments.length})</h2>
            <div className="mycourses-grid">
              {enrollments.map(enr => {
                const course = enr.courses;
                if (!course) return null;
                const total = enr.totalLessons;
                const done = enr.completedLessons;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <Link
                    to={`/my-courses/${course.id}`}
                    key={enr.id}
                    className="mycourse-card"
                  >
                    <div className="mycourse-image">
                      <ImageWithFallback src={course.image_url} alt={course.name} />
                    </div>
                    <div className="mycourse-body">
                      <h3>{course.name}</h3>
                      <p>{course.excerpt?.substring(0, 80) || 'Continue learning...'}</p>

                      {total > 0 && (
                        <>
                          <div className="mycourse-progress-bar">
                            <div
                              className="mycourse-progress-fill"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="mycourse-progress-text">
                            {done} / {total} lessons · {percent}%
                          </div>
                        </>
                      )}

                      <span className="mycourse-cta">
                        {percent === 100 ? '✅ Completed' : percent > 0 ? 'Continue →' : 'Start Course →'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default MyCourses;
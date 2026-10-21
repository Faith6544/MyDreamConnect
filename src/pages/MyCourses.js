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

      // Get enrollments
      const { data: enrollData, error } = await supabase
        .from('enrollments')
        .select('id, enrolled_at, course_id')
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error || !enrollData) {
        setLoading(false);
        return;
      }

      if (enrollData.length === 0) {
        setEnrollments([]);
        setLoading(false);
        return;
      }

      // Fetch courses separately
      const courseIds = [...new Set(enrollData.map(e => e.course_id))];
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);

      const courseMap = {};
      (coursesData || []).forEach(c => { courseMap[c.id] = c; });

      // Attach courses + fetch lesson counts
      const enriched = await Promise.all(
        enrollData.map(async (enr) => {
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
            courses: courseMap[courseId] || null,
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
      <div className="mycourses-container">
        
        {/* CLEAN UNDERLINED TITLE */}
        <h1 className="mycourses-title">Welcome, {displayName} 👋</h1>
        <p className="mycourses-subtitle">Your learning dashboard</p>

        <section className="mycourses-content">
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Loading your courses...</p>
          ) : enrollments.length === 0 ? (
            <div className="mycourses-empty">
              <h2>You're not enrolled in any courses yet</h2>
              <p>Browse our catalog and enroll to get started, or apply for financial aid.</p>
              
              {/* UPDATED BUTTONS HERE */}
              <div className="mycourses-actions">
                <Link to="/courses" className="mycourses-btn">
                  Browse Courses →
                </Link>
                <Link to="/scholarship" className="mycourses-scholarship-btn">
                  Apply for a Course Scholarship 🎓
                </Link>
              </div>

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
                          {percent === 100 ? '🎓 View Certificate →' : percent > 0 ? 'Continue →' : 'Start Course →'}
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
    </div>
  );
}

export default MyCourses;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import './MyCourses.css';

function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]); // NEW STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        setEnrollments([]);
        setLoading(false);
        return;
      }

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
        // Even if they have no enrollments, we still want to fetch featured courses
        fetchFeaturedCourses();
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
          const course = courseMap[courseId] || null;

          const { count: totalLessons } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId);

          const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId)
            .eq('user_id', user.id);

          const total = totalLessons || 0;
          const done = completedLessons || 0;

          return {
            ...enr,
            courses: course,
            totalLessons: total,
            completedLessons: done,
          };
        })
      );

      setEnrollments(enriched);
      fetchFeaturedCourses(courseIds); // Fetch featured courses, excluding the ones they already own
    };

    // NEW FUNCTION TO FETCH TOP 3 FEATURED COURSES
    const fetchFeaturedCourses = async (excludeIds = []) => {
      // Fetch all courses and their enrollment counts
      const { data: allCourses } = await supabase
        .from('courses')
        .select('*, enrollments(count)');

      if (allCourses) {
        // Sort by enrollment count descending
        const sorted = allCourses.sort((a, b) => {
          const countA = a.enrollments?.[0]?.count || 0;
          const countB = b.enrollments?.[0]?.count || 0;
          return countB - countA;
        });
        
        // Filter out courses the user is already enrolled in
        const filtered = sorted.filter(c => !excludeIds.includes(c.id));
        
        // Grab top 3
        setFeaturedCourses(filtered.slice(0, 3));
      }
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
            <p style={{ textAlign: 'center', color: '#888' }}>Loading your dashboard...</p>
          ) : enrollments.length === 0 ? (
            <div className="mycourses-empty">
              <h2>You're not enrolled in any courses yet</h2>
              <p>Browse our catalog and enroll to get started, or apply for financial aid.</p>
              
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
                  const total = enr.totalLessons || 0;
                  const done = enr.completedLessons || 0;
                  const percent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

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

          {/* --- NEW: FEATURED COURSES SECTION --- */}
          {!loading && featuredCourses.length > 0 && (
            <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
              <h2 className="mycourses-heading" style={{ marginBottom: '20px' }}>Featured Courses 🔥</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Most popular courses people are enrolling in right now.</p>
              
              <div className="mycourses-grid">
                {featuredCourses.map(course => (
                  <Link
                    to={`/courses/${course.id}`}
                    key={course.id}
                    className="mycourse-card"
                  >
                    <div className="mycourse-image">
                      <ImageWithFallback src={course.image_url} alt={course.name} />
                    </div>
                    <div className="mycourse-body">
                      <h3>{course.name}</h3>
                      <p>{course.excerpt?.substring(0, 80) || 'Explore this course...'}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontWeight: '700', color: '#0a4711' }}>
                          {course.price ? `₦${Number(course.price).toLocaleString()}` : 'Free'}
                        </span>
                        <span className="mycourse-cta">View Course →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* EXPLORE MORE COURSES BUTTON (Now pushed to the very bottom) */}
          {!loading && (
            <div className="explore-more-wrapper" style={{ marginTop: '80px', paddingBottom: '40px', textAlign: 'center' }}>
              <Link to="/courses" className="explore-more-btn">
                Explore More Courses →
              </Link>
            </div>
          )}
          
        </section>
      </div>
    </div>
  );
}

export default MyCourses;